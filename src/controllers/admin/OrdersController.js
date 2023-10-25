import Model from '../../models/OrdersModel.js';

class OrdersController {
  async getAll(req, res) {
    try {
      const companyId = req.headers._id;

      const orders = await Model.find();
      
      return res.status(200).json(orders);
    } catch (error) {
      console.log(error);
    }
  }
}

export default OrdersController;
