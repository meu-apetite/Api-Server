import Model from '../../models/OrdersModel.js';

class OrdersController {
  async getAll(req, res) {
    const company = req.headers._id;
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;

    try {
      const totalOrders = await Model.countDocuments({ company });
      const totalPages = Math.ceil(totalOrders / perPage);

      const orders = await Model.find({ company })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();

        console.log(orders)

      return res.status(200).json({ orders, totalPages, page });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro ao obter os produtos.' });
    }

  }
}

export default OrdersController;
