import mongoose from 'mongoose';
import { allMethods } from '../utils/fetchPaymentMethods.js';
const { Schema } = mongoose;

const companySchema = new Schema({
  urlName: { type: String },
  fantasyName: { type: String, required: true }, 
  slogan: String,
  description: String,
  whatsapp: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  active: { type: Boolean, default: true },
  owner: {
    name: { type: String, required: true },
    phoneNumber: { type: String },
    email: { type: String },
  },
  address: {
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    number: { type: Number, trim: true },
    reference: { type: String, trim: true },
    street: { type: String, trim: true },
    district: { type: String, trim: true },
    zipCode: { type: String, maxLength: 8 },
    coordinates: { latitude: Number, longitude: Number },
    freeformAddress: { type: String, trim: true }
  },
  custom: {
    colors: { 
      primary: { type: String, default: '' }, 
      secundary: { type: String, default: '' } 
    },
    logo: { url: String, id: String },
    gallery: [{ url: String, id: String }]
  },
  subscription: { endpoint: String, keys: { p256dh: String, auth: String } },
  settings: {
    openingHours: {
      monday: { type: String },
      tuesday: { type: String },
      wednesday: { type: String },
      thursday: { type: String },
      friday: { type: String },
      saturday: { type: String },
      sunday: { type: String },
    },
  },
  settingsPayment: {
    methods: {
      type: [{ id: String, title: String }], 
      default: allMethods
    },
    mercadoPago: { active: Boolean, publicKey: String, accessToken: String },
  },
  settingsDelivery: {
    allowStorePickup: { type: Boolean, default: true },
    delivery: { type: Boolean, default: true },
    deliveryOption: {
      type: String,
      default: 'customerPickup',
      enum: ['automatic', 'customerPickup', 'fixed'],
    },
    minValue: { type: Number, default: 0},
    kmValue: { type: Number, default: 0},
    fixedValue: { type: Number, default: 0}
  }
}); 

export default mongoose.model('companies', companySchema);
