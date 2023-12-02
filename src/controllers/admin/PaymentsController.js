import Model from '../../models/CompanyModel.js';
import { methodInCategory } from "../../utils/fetchPaymentMethods.js";


class PaymentsController {
  getMethodInCategory = async (req, res) => {
    try {
      return res.status(200).json(methodInCategory);
    } catch (error) {
      console.log(error);
    }
  }

  async updateCredentialsMercadoPago(req, res) {
    try {
      const companyId = req.headers._id;
      const { publicKey, accessToken } = req.body;

      if (!publicKey || !accessToken) {
        return res.status(400).json({ success: false, message: 'As credênciais estão vazias' });
      }

      await Model.findByIdAndUpdate(companyId, {
        $set: {
          'settingsPayment.mercadoPago.publicKey': publicKey,
          'settingsPayment.mercadoPago.accessToken': accessToken
        }
      });
      
      return res.status(200).json({ publicKey: true, accessToken: true });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false });
    }
  }

  async updatePaymentsMethods(req, res) {
    console.log(req.body)
    try {
      const companyId = req.headers._id;
      const data = req.body;

      if (data.length < 1) {
        return res.status(200).json({ 
          success: false, 
          message: 'Não é permitido desativar todas as formas de pagamentos' 
        });
      }

      const response = await Model.findByIdAndUpdate(
        companyId,   
        { $set: { 'settingsPayment.methods': data } },
        { new: true }
      );

      return res.status(200).json(response.settingsPayment.methods);
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false });
    }
  }

  async getPaymentOptions(req, res) {
    try {
      const companyId = req.headers._id;
      const credentialsMP = { accessToken: false, publicKey: true };

      const response = await Model.findById(companyId, 'paymentsMethods paymentOnline');

      if (response?.paymentOnline?.credentialsMP?.accessToken) {
        credentialsMP.accessToken = true;
      }

      if (response?.paymentOnline?.credentialsMP?.publicKey) {
        credentialsMP.publicKey = true;
      }

      response.paymentOnline.credentialsMP = credentialsMP;

      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  }
}

export default PaymentsController;
