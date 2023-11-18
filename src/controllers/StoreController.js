import ProductModel from '../models/ProductsModel.js';
import CompanyModel from '../models/CompanyModel.js';
import OrdersModel from '../models/OrdersModel.js';
import jwt from 'jsonwebtoken';
import mercadopago from 'mercadopago';
import axios from 'axios';
import listPaymentMethod from "../utils/listPaymentMethod.js";
import { NotificationService } from '../services/NotificationService.js';
import { EmailService } from '../services/EmailService.js';


const api = 'https://api.tomtom.com/search/2/geocode';
const key = 'GmL5wOEl3iWP0n1l6O5sBV0XKo6gHwht';

class StoreController {
  async getAllProduct(req, res) {
    try {
      const companyId = req.params?.companyId;

      const products = await ProductModel.find({ company: companyId })
        .populate('category', 'title')
        .populate({ path: 'complements' })
        .select('-isActive -company -code')
        .exec();

      return res.status(200).json(products);
    } catch (error) {
      console.log(error);
    }
  }

  async getStore(req, res) {
    try {
      const companyId = req.params?.companyId;
      const store = await CompanyModel.findById(companyId)
        .select('fantasyName custom address subscription');

      return res.status(200).json(store);
    } catch (error) {
      console.error(error);
    }
  }

  async getStoreView(req, res) {
    try {
      const companyId = req.params?.companyId;
      const store = await CompanyModel.findByIdAndUpdate(
        companyId,
        { $inc: { views: 1 } },
        { new: true } 
      ).select('fantasyName custom address subscription')
      return res.status(200).json(store);
    } catch (error) {
      console.error(error);
    }
  }

  async estimateValueFromData(listProduct) {
    /**[
     *   {
     *      complements: [{ 
     *        parentId: string, //id of group complement 
     *        id: string,  //id of option complement
     *        quantity: number //quantity of option complement
     *      }],
     *      productId: string,
     *      quantity: number
     *   }
     * ]  
     * */

    try {
      const requestInfo = []; //info of request;
      let priceTotal = 0;

      for (const item of listProduct) {
        const product = await ProductModel.findById('6521bcfef5dac76881e66620')
          .populate({ path: 'complements', select: '-company' })
          .select('name price images.url')
          .exec();

        let priceOption = 0;
        let price = 0;
        const complements = [];

        if (product.complements.length) {
          item.complements.map((option) => {
            const resultComplements = product.complements.find(c => c._id.toString() == option.parentId);
            const resultOption = resultComplements.options.find(o => o._id == option.id);

            for (let i = 0; i < option.quantity; i++) {
              priceOption += resultOption.price;
              complements.push({
                name: resultOption.name,
                price: resultOption.price,
                parentId: option.parentId,
                _id: resultOption._id
              });
            }
          });
        }

        for (let i = 0; i < item.quantity; i++) {
          price += (product.price + priceOption);
        }

        priceTotal += price;

        requestInfo.push({
          complements,
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          priceTotal: price,
          imageUrl: product.images[0]['url']
        });
      };

      return { products: requestInfo, total: priceTotal };
    } catch (error) {
      console.error(error);
    }
  }

  estimateValue = async (req, res) => {
    try {
      const listProduct = [...req.body];
      const result = await this.estimateValueFromData(listProduct);
      const productsToken = jwt.sign(result, process.env.TOKEN_KEY, { expiresIn: '120 days' });
      return res.status(200).json({ productsToken, ...result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  };

  calculateFreight = async (req, res) => {
    /** req: { 
      *    address: {
      *      street: string, number: number, zipCode: string, district: string, city: string
      *    },
      *    storeId: string,
      *    items: [
      *     {
      *       complements: [{}],
      *       productId: string,
      *       quantity: number
      *     }
      *   ]
      * 
      *  **/

    try {
      const { address } = req.body;

      const query = `${address.street},${address.number},${address.zipCode},${address.district},${address.city}`;
      const responseClientAddress = await axios.get(api + `/${encodeURIComponent(query)}.json?key=${key}`);
      const result = responseClientAddress.data.results[0];

      const company = await CompanyModel.findById('644d03bb1169fea569ff4348').select('address');
      const queryCalculate = `${company.address.coordinates.latitude},${company.address.coordinates.longitude}:${result.position.lat},${result.position.lon}`;
      const responseCalculate = await axios.get(`https://api.tomtom.com/routing/1/calculateRoute/${queryCalculate}/json?key=${key}`);

      const distanceInKm = responseCalculate.data.routes[0].summary.lengthInMeters / 1000;
      const costPerKm = 5;
      const totalCost = distanceInKm * costPerKm;

      const addressResult = {
        destination: { latitude: result.position.lat, longitude: result.position.lon },
        distance: distanceInKm,
        price: totalCost,
        number: result.address.streetNumber,
        street: result.address.streetName,
        district: result.address.municipalitySubdivision,
        city: result.address.municipality,
        freeformAddress: result.address.freeformAddress
      };

      const addressToken = jwt.sign(addressResult, process.env.TOKEN_KEY, { expiresIn: '120 days' });

      return res.status(200).json({ address: addressResult, addressToken });
    } catch (error) {
      console.error(error);
    }
  };

  async getPreferenceIdMp(products) {
    try {
      console.log(products);
      mercadopago.configure({ access_token: 'TEST-1944498221096339-010600-f3917d8d9a0242baa5b2236a9d4ac87e-225270724' });
      const preference = {
        items: products?.map((item) => ({
          title: item.name, unit_price: item.total, quantity: item.quantity
        }))
      };
      const response = await mercadopago.preferences.create(preference);
      return response.body.id;
    } catch (error) {
      console.error('erroo ', error);
    }
  }

  getPaymentOptions = async (req, res) => {
    try {
      const { companyId } = req.params;
      const { products } = req.body;

      const preferenceId = await this.getPreferenceIdMp(products);
      const response = await CompanyModel.findById(companyId, 'paymentsMethods paymentOnline');

      return res.status(200).json({
        activeItems: response.paymentsMethods,
        paymentOnline: {
          ...response.paymentOnline,
          credentialsMP: {
            ...response.paymentOnline.credentialsMP,
            preferenceId
          }
        },
        listPaymentMethod
      });
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  };

  async finishOrder(req, res) {
    //deliveryType: 'pickup', paymentMethod: 'dinheiro', paymentType: 'inDelivery', products: [{}] 
    try {
      const { companyId } = req.params;
      const { 
        productsToken, 
        addressToken, 
        deliveryType, 
        paymentType, 
        email, 
        name,
        phoneNumber 
      } = req.body;
      const products = jwt.decode(productsToken).products;
      const address = jwt.decode(addressToken);

      const order = await OrdersModel.create({
        company: companyId,
        deliveryType,
        products,
        address,
        paymentType,
        client: { email, name, phoneNumber },
        status: 'awaiting-approval'
      });

      const store = await CompanyModel.findById(companyId)
        .select('fantasyName custom address subscription');

      const notificationService = new NotificationService(
        store.subscription.endpoint, store.subscription.keys
      );

      await notificationService.send('Novo pedido!', 'Você tem um novo pedido');
      
      //store email
      await new EmailService().send({
        to: "gneris.gs@gmail.com", 
        subject: "Novo pedido!",
        text: "Você tem um novo pedido"
      });

      //client email
      await new EmailService().send({
        to: email.trim(), 
        subject: "Pedido recibo!",
        text: `Olá ${name.trim()}, obrigado por ter comprado conosco, seu pedido está em preparo`
      });

      return res.json({ order, store });

    } catch (error) {
      console.log('erroo ', error);
    }
  }
}

export default StoreController;
