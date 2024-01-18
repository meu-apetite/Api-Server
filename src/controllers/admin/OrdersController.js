import Model from '../../models/OrdersModel.js';
import { getStatus } from '../../utils/orderStatus.js';

class OrdersController {
  async  getOrders(req, res) {
    const company = req.headers.companyid;
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
  
    try {
      const totalOrders = await Model.countDocuments({ company });
      const totalPages = Math.ceil(totalOrders / perPage);
  
      const orders = await Model.find({ company })
        .sort({ date: -1 }) 
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
  
      return res.status(200).json({ orders, totalPages, page });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro ao obter os produtos.' });
    }
  }

  async updateOrderStatus(req, res) {
    const company = req.headers.companyid;
    const { orderId, status } = req.body;

    try {
      const existingOrder = await Model.findOne({ _id: orderId });

      if (!existingOrder) {
        return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
      }

      if (String(existingOrder.company) !== company) {
        return res.status(404).json({ success: false, message: 'Falha ao alterar o status' });
      }

      await Model.findByIdAndUpdate(orderId, { $set: { status: getStatus(status) } })

      return res.status(200).json({ success: true, message: 'Pedido atualizado.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar o status do pedido.' });
    }
  }

  async getOrdersdashboard(req, res) {
    try {
      const company = req.headers.companyid;
      const orders = await Model.find({ company });
      return res.status(200).json(orders);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro ao obter os produtos.' });
    }
  }
}

export default OrdersController;
