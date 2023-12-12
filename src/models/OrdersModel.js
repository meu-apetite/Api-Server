import moment from 'moment-timezone';
import mongoose from 'mongoose';
const { Schema } = mongoose;
const orderStatusEnum = ['awaiting-approval', 'ready', 'delivered'];

const ordersSchema = new Schema({
  id: Number,
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'companies',
    require: true,
  },
  client: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
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
  paymentMethod: {
    type: { icon: String, id: String, title: String, _id: String },
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
  date: { type: Date, default: () => moment().tz('America/Sao_Paulo') },
  total: Number
});


ordersSchema.pre('save', function(next) {
  const doc = this;
  mongoose.model('Orders', ordersSchema, 'orders').findOne({}, {}, { sort: { 'id': -1 } }).exec(function(err, result) {
    let lastId = 0;
    if (result && result.id) lastId = result.id;
    doc.id = lastId + 1;
    next();
  });
});

export default mongoose.model('orders', ordersSchema);
