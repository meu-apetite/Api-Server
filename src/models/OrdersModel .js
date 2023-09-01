import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderStatusEnum = ['in-cart', 'awaiting-approval', 'approved', 'ready', 'delivered'];

const ordersSchema = new Schema({
  status: {
    type: String,
    enum: orderStatusEnum,
    required: true
  },
  products: [{ 
    complements: [], 
    productId: String,
    productName: String,
    quantity: Number,
    imageUrl: String,
    priceTotal: Number
  }],
  payment: {
    mercadoPagoId: String
  },
  delivery: {
    type: {
      type: String,
      enum: ['pickup', 'delivery'],
      required: true
    },
    destination: {
      latitude: Number,
      longitute: Number
    },
    distance: Number,
    price: Number
  },  
  total: Number
});

export default mongoose.model('orders', ordersSchema);
