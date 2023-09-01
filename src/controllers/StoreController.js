import ProductModel from '../models/ProductModel.js';
import StoreModel from '../models/CompanyModel.js';
import mercadopago from 'mercadopago';
import axios from 'axios';
import OrdersModel from '../models/OrdersModel .js';

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

      const store = await StoreModel.findById(companyId)
        .select('fantasyName custom address');

      return res.status(200).json(store);
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  }

  estimateValue = async (req, res) => {
    try {
      const listProduct = [...req.body];

      const result = await this.estimateValueFromData(listProduct);

      if (result) {
        console.log(result);
        return res.status(200).json(result);
      } else {
        return res.status(500).json({ error: "An error occurred" });
      }
    } catch (error) {
      console.log(error);
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
      const { address, items, storeId } = req.body;

      const query = `${address.street},${address.number},${address.zipCode},${address.district},${address.city}`;
      const responseClientAddress = await axios.get(api + `/${encodeURIComponent(query)}.json?key=${key}`);
      const result = responseClientAddress.data.results[0];

      const company = await StoreModel.findById('644d03bb1169fea569ff4348').select('address');
      const queryCalculate = `${company.address.coordinates.latitude},${company.address.coordinates.longitude}:${result.position.lat},${result.position.lon}`;
      const responseCalculate = await axios.get(`https://api.tomtom.com/routing/1/calculateRoute/${queryCalculate}/json?key=${key}`);

      const distanceInKm = responseCalculate.data.routes[0].summary.lengthInMeters / 1000;
      const costPerKm = 5;
      const totalCost = distanceInKm * costPerKm;

      const estimateValue = await this.estimateValueFromData(items);
      const mercadopago = await this.payment();
      
  
      const order = await OrdersModel.create({
        ...estimateValue,
        payment: { mercadoPagoId: mercadopago },
        status: 'in-cart',
        delivery: {
          type: 'delivery',
          destination: { latitude: result.position.lat, longitude: result.position.lon },
          distance: distanceInKm,
          price: totalCost
        }
      });

      console.log(order);

      return res.status(200).json(order);
    } catch (error) {
      console.error(error);
    }
  };

  async payment() {
    try {
      mercadopago.configure({ access_token: 'TEST-1944498221096339-010600-f3917d8d9a0242baa5b2236a9d4ac87e-225270724' });

      let preference = {
        items: [
          { title: 'My Item', unit_price: 100, quantity: 1 },
          { title: 'My Item', unit_price: 100, quantity: 1 },
        ]
      };

      const response = await mercadopago.preferences.create(preference);

      return response.body.id;
    } catch (error) {
      console.log('erroo ', error);
    }
  }
}

export default StoreController;
