import listPaymentMethod from "../../utils/listPaymentMethod.js";

class PaymentsMethodsController {
  getAll = async (req, res) => {
    try {
      return res.status(200).json(listPaymentMethod);
    } catch (error) {
      console.log(error);
    }
  }
}

export default PaymentsMethodsController;
