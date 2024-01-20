import ProductModel from '../models/ProductsModel.js';
import CompanyModel from '../models/CompanyModel.js';
import OrdersModel from '../models/OrdersModel.js';
import CategoriesModel from '../models/CategoriesModel.js';
import jwt from 'jsonwebtoken';
import mercadopago from 'mercadopago';
import { NotificationService } from '../services/NotificationService.js';
import { EmailService } from '../services/EmailService.js';
import { TomtomService } from '../services/TomtomService.js';
import { PixService } from '../services/Pixservice.js';
import mongoose from 'mongoose';
import moment from 'moment-timezone';

class StoreController {
  async getCollections(req, res) {
    try {
      const storeUrl = req.params?.storeUrl;
      const company = await CompanyModel.findOne({ storeUrl });

      if (!company) return res.status(404).json({ success: false, message: 'Loja não encontrada' });
      
      const productsWithCategories = await CategoriesModel.aggregate([
        {
          $match: { company: mongoose.Types.ObjectId(company._id), isActive: true }
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'category',
            as: 'products',
          },
        },
        {
          $project: {
            title: 1,
            products: {
              $filter: {
                input: '$products',
                as: 'product',
                cond: { $eq: ['$$product.isActive', true] },
              },
            },
          },
        },
        { $unwind: '$products' },
        {
          $lookup: {
            from: 'complements',
            localField: 'products.complements',
            foreignField: '_id',
            as: 'products.complements',
          },
        },
        {
          $group: {
            _id: '$_id', title: { $first: '$title' }, products: { $push: '$products' }
          },
        },
      ]);

      return res.status(200).json(productsWithCategories);
    } catch (error) {
      console.log(error);
    }
  }

  async getStore(req, res) {
    try {
      const storeUrl = req.params?.storeUrl;
      const store = await CompanyModel.findOne({ storeUrl }).select(
        'fantasyName ' + 'description ' + 'settings ' + 
        'settingsPayment ' + 'custom ' + 'address ' + 
        'subscription ' + 'settingsDelivery ' + 'storeUrl ' + 'online'
      ).lean();

      if (!store || !store.online) {
        return res.status(404).json({ success: false, message: 'Cárdapio não encontrado' });
      }

      const time = moment().tz('America/Sao_Paulo');
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const openDay = store.settings.openingHours[days[time.day()]];
      const hour = moment(time.format('HH:mm'), 'HH:mm');

      if (
        hour.isSameOrAfter(moment(openDay.open, 'HH:mm')) 
        && hour.isSameOrBefore(moment(openDay.close, 'HH:mm'))
      ) {
        store.isOpen = true;
      } else {
        store.isOpen = false;
      }

      return res.status(200).json(store);
    } catch (error) {
      console.log(error);
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
          const address = { ...addressData, problem: 'A taxa não foi calculada automáticamente' };
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
      console.log(req);
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
      const { companyId, productsToken } = req.body;
      const preferenceId = await this.getPreferenceIdMp(jwt.decode(productsToken).products);
      const company = await CompanyModel.findById(companyId, 'settingsPayment');

      return res.status(200).json({
        preferenceId,
        mercadoPago: company.settingsPayment.mercadoPago,
        methods: company.settingsPayment.methods,
        pix: company.settingsPayment.pix
      });
    } catch (error) {
      console.log(error)
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

      const { products, total: totalProduct } = jwt.decode(productsToken);
      const address = jwt.decode(addressToken);
      const total = totalProduct + (address?.price || 0);

      if (!productsToken) {
        return res.status(400).json({ success: false, message: 'É necessário passar o token dos produtos' });
      }
      if (!paymentMethod) {
        return res.status(400).json({ success: false, message: 'Método de pagamento não informado' });
      }

      let status = { name: "OrderReceived", label: "Pedido Recebido" };
      if (paymentType === 'pix') {
        status =  { name: "WaitingForPaymentConfirmation", label: "Aguardando Confirmação de Pagamento." };
      } 

      const order = await OrdersModel.create({
        company: companyId,
        deliveryType,
        products,
        address,
        paymentType,
        paymentMethod,
        total,
        status,
        client: { email, name, phoneNumber },
      });

      const company = await CompanyModel.findById(companyId)
        .select('fantasyName custom address subscription storeUrl');

      if (company?.subscription.endpoint) {
        const notificationService = new NotificationService(company.subscription.endpoint, company.subscription.keys);
        await notificationService.send('Novo pedido!', 'Você tem um novo pedido');
      }

      //store email
      await new EmailService().sendEmailOrder({ to: company.email, subject: 'Novo pedido!' }, order);
      // client email
      await new EmailService().sendEmailOrder({ to: email.trim(), subject: 'Novo pedido!' }, order);
   
      return res.json({ order, company });
    } catch (error) {
      console.log('erroo ', error);
    }
  }

  async getOrder(req, res) {
    try {
      const { storeUrl, orderId } = req.params;
      const company = await CompanyModel.findOne({ storeUrl }).select(
        'fantasyName custom address subscription storeUrl whatsapp settingsPayment'
      ).lean();

      if (!company._id) {
        return res.status(400).json({ success: false, message: 'Não foi possível encontrar a loja' });
      }

      const order = await OrdersModel.findOne({ id: orderId, company: company._id });

      const settingsPayment = company.settingsPayment;
      delete company.settingsPayment
      
      if (order.status?.name == 'WaitingForPaymentConfirmation' && order.paymentType == 'pix') {
        console.log(          
          settingsPayment.pix.key,
          settingsPayment.pix.name,
          settingsPayment.pix.city,
          order.id,
          order.total
        )

        const pix = new PixService(
          settingsPayment.pix.key,
          "TESTE",
          settingsPayment.pix.name,
          settingsPayment.pix.city,
          ''+order.id,
          order.total
        );
        company.pixCode = pix.getPayload();
      }

      if (!order._id) {
        return res.status(400).json({ success: false, message: 'Não foi possível encontrar o pedido' });
      }

      return res.status(200).json({ order, company });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro ao obter os produtos.' });
    }
  }
}

export default StoreController;
