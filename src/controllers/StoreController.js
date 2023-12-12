import ProductModel from '../models/ProductsModel.js';
import CompanyModel from '../models/CompanyModel.js';
import OrdersModel from '../models/OrdersModel.js';
import jwt from 'jsonwebtoken';
import mercadopago from 'mercadopago';
import axios from 'axios';
import { NotificationService } from '../services/NotificationService.js';
import { EmailService } from '../services/EmailService.js';
import { TomtomService } from '../services/TomtomService.js';
import { json } from 'express';

class StoreController {
  async getAllProduct(req, res) {
    try {
      const storeUrl = req.params?.storeUrl;
      const company = await CompanyModel.findOne({ storeUrl });

      if (!company) return res.status(400).json({ success: false, message: 'Loja não encontrada' });

      const products = await ProductModel.find({ company: company._id })
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
      const storeUrl = req.params?.storeUrl;
      const store = await CompanyModel.findOne({ storeUrl }).select(
        'fantasyName description settings settingsPayment custom address subscription settingsDelivery storeUrl'
      );

      return res.status(200).json(store);
    } catch (error) {
      console.error(error);
    }
  }

  async getStoreView(req, res) {
    try {
      const storeUrl = req.params?.storeUrl;
      const store = await CompanyModel.findByIdAndUpdate(
        storeUrl,
        { $inc: { views: 1 } },
        { new: true }
      ).select('fantasyName custom address subscription storeUrl');
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
        const product = await ProductModel.findById(item.productId)
          .populate({ path: 'complements', select: '-company' })
          .select('name price images.url')
          .exec();

        let priceOption = 0;
        let price = 0;
        const complements = [];

        if (product.complements.length) {
          item.complements.map((option) => {
            const resultComplements = product.complements.find(
              (c) => c._id.toString() == option.parentId
            );
            const resultOption = resultComplements.options.find(
              (o) => o._id == option.id
            );

            for (let i = 0; i < option.quantity; i++) {
              priceOption += resultOption.price;
              complements.push({
                name: resultOption.name,
                price: resultOption.price,
                parentId: option.parentId,
                _id: resultOption._id,
              });
            }
          });
        }

        for (let i = 0; i < item.quantity; i++) {
          price += product.price + priceOption;
        }
        priceTotal += price;

        requestInfo.push({
          complements,
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          priceTotal: price,
          imageUrl: product.images[0]['url'],
        });
      }
      return { products: requestInfo, total: priceTotal };
    } catch (error) {
      console.error(error);
    }
  }

  estimateValue = async (req, res) => {
    try {
      const listProduct = [...req.body];
      const result = await this.estimateValueFromData(listProduct);
      const productsToken = jwt.sign(result, process.env.TOKEN_KEY, {
        expiresIn: '120 days',
      });
      return res.status(200).json({ productsToken, ...result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred' });
    }
  };

  calculateFreight = async (req, res) => {
    /** body: {
     *    address: { street: string, number: number, zipCode: string, district: string, city: string },
     *    storeId: string,
     *    items: [{ complements: [{}], productId: string, quantity: number }]
     *  **/

    try {
      const { companyId, address: addressData } = req.body;
      const company = await CompanyModel.findById(companyId).select('address settingsDelivery');

      if (company.settingsDelivery.deliveryOption === 'customerPickup') {
        const addressClient = { ...addressData, deliveryOption: 'customerPickup' };
        const addressToken = jwt.sign(addressClient, process.env.TOKEN_KEY, { expiresIn: '120 days' });
        return res.status(200).json({ address: addressClient, addressToken });
      }

      if (company.settingsDelivery.deliveryOption === 'fixed') {
        const addressClient = { 
          ...addressData, 
          deliveryOption: 'fixed', 
          price: company.settingsDelivery.fixedValue 
        };
        const addressToken = jwt.sign(addressClient, process.env.TOKEN_KEY, { expiresIn: '120 days' });
        return res.status(200).json({ address: addressClient, addressToken });
      }

      if (company.settingsDelivery.deliveryOption === 'automatic') {
        if (!addressData?.zipCode) {
          if (!addressData?.street) {
            return res.status(400).json({ success: false, message: 'Rua não informada' });
          } 
          if (!addressData?.district) {
            return res.status(400).json({ success: false, message: 'Bairro não informado' });
          } 
          if (!addressData?.city) {
            return res.status(400).json({ success: false, message: 'Cidade não informada' });
          } 
          if (!addressData?.number) {
            return res.status(400).json({ success: false, message: 'Número da casa não informado' });
          } 
          const address = { ...addressData, problem: 'A taxa não foi calculada automáticamente' }
          const addressToken = jwt.sign(addressData, process.env.TOKEN_KEY, { expiresIn: '120 days' });
          return res.status(200).json({ address: addressData, addressToken });
        }

        const tomtomService = new TomtomService();
        const findAddress = await tomtomService.findAddress({ ...addressData });
        const address = findAddress[0];
        const positions = [
          company.address.coordinates.latitude,
          company.address.coordinates.longitude,
          address.position.lat,
          address.position.lon
        ];
        const calculateDistance = await tomtomService.getDistance(...positions);
        const distanceInKm = calculateDistance.routes[0].summary.lengthInMeters / 1000;
        const addressClient = {
          zipCode: address.address.extendedPostalCode,
          position: { latitude: address.position.lat, longitude: address.position.lon },
          distance: distanceInKm,
          price: (distanceInKm * company.settingsDelivery.kmValue) + company.settingsDelivery.minValue,
          number: address.address.streetNumber,
          street: address.address.streetName,
          district: address.address.municipalitySubdivision,
          city: address.address.municipality,
          freeformAddress: address.address.freeformAddress,
          deliveryOption: 'automatic'
        };
        const addressToken = jwt.sign(addressClient, process.env.TOKEN_KEY, { expiresIn: '120 days' });
        return res.status(200).json({ address: addressClient, addressToken });
      }
    } catch (error) {
      console.error(error);
    }
  };

  async paymentConfirmation(req, res) {
    try {
      console.log(req)
    } catch (error) {
      console.error('erroo ', error);
    }
  }

  async getPreferenceIdMp(products) {
    try {
      mercadopago.configure({ access_token: 'TEST-1944498221096339-010600-f3917d8d9a0242baa5b2236a9d4ac87e-225270724' });
      const preference = {
        items: products.map((item) => ({
          title: item.name, unit_price: item.priceTotal, quantity: item.quantity,
        })),
      };
      const response = await mercadopago.preferences.create(preference);
      return response.body.id;
    } catch (error) {
      console.error('erroo ', error);
    }
  }

  getPaymentOptions = async (req, res) => {
    try {
      console.log(req.body)
      const { companyId, productsToken } = req.body;

      const preferenceId = await this.getPreferenceIdMp(jwt.decode(productsToken).products);
      const company = await CompanyModel.findById(companyId, 'settingsPayment');

      return res.status(200).json({
        preferenceId,
        mercadoPago: company.settingsPayment.mercadoPago,
        methods: company.settingsPayment.methods
      });
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  };

  async finishOrder(req, res) {
    //deliveryType: 'pickup', paymentMethod: 'dinheiro', paymentType: 'inDelivery', products: [{}]
    try {
      const { 
        companyId,
        productsToken, 
        addressToken, 
        deliveryType, 
        paymentType, 
        paymentMethod, 
        email, 
        name, 
        phoneNumber 
      } = req.body;
      const { products, total } = jwt.decode(productsToken);
      const address = jwt.decode(addressToken);

      if (!productsToken) {
        return res.status(400).json({ 
          success: false, message: 'É necessário passar o token dos produtos' 
        });
      }

      if (!paymentMethod) {
        return res.status(400).json({ 
          success: false, message: 'Método de pagamento não informado' 
        });
      }

      const order = await OrdersModel.create({
        company: companyId,
        deliveryType,
        products,
        address,
        paymentType,
        paymentMethod, 
        total,
        client: { email, name, phoneNumber },
        status: 'awaiting-approval',
      });

      const company = await CompanyModel.findById(companyId)
        .select('fantasyName custom address subscription storeUrl');

      if(company?.subscription.endpoint) {
        const notificationService = new NotificationService(company.subscription.endpoint, company.subscription.keys);
        await notificationService.send('Novo pedido!', 'Você tem um novo pedido');
      }
      
      //store email
      await new EmailService().sendEmailOrder(
        { to: 'gneris177@gmail.com', subject: 'Novo pedido!' }, 
        order
      );

      // client email
      await new EmailService().sendEmailOrder(
        { to: email.trim(), subject: 'Novo pedido!' }, 
        order
      );
      // await new EmailService().send({
      //   to: email.trim(),
      //   subject: 'Pedido recibo!',
      //   text: `Olá ${name.trim()}, obrigado por ter comprado conosco, seu pedido está em preparo`,
      // });

      return res.json({ order, company });
    } catch (error) {
      console.log('erroo ', error);
    }
  }

  async getOrder(req, res) {
    try {
      const { storeUrl, orderId } = req.params;
      const company = await CompanyModel.findOne({ storeUrl })
        .select('fantasyName custom address subscription storeUrl');

      if (!company._id) {
        return res.status(400).json({ 
          success: false, message: 'Não foi possível encontrar a loja' 
        });
      }

      const order = await OrdersModel.findOne({ id: orderId, company: company._id });

      if (!order._id) {
        return res.status(400).json({ 
          success: false, message: 'Não foi possível encontrar o pedido' 
        });
      }

      return res.status(200).json({ order, company });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro ao obter os produtos.' });
    }
  }
}

export default StoreController;
