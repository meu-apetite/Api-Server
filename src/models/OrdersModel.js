import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderStatusEnum = ['awaiting-approval', 'ready', 'delivered'];

const ordersSchema = new Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'companies',
    require: true,
  },
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
  paymentType: {
    type: String,
    enum: ['online', 'indelivery'],
    required: true
  },
  deliveryType: {
    type: String,
    enum: ['pickup', 'delivery'],
    required: true
  },
  address: {
    destination: { latitude: Number, longitude: Number },
    distance: Number,
    price: Number,
    number: String,
    street: String,
    district: String,
    city: String,
    freeformAddress: String
  },
  total: Number
});

export default mongoose.model('orders', ordersSchema);
