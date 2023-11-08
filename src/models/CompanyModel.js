import mongoose from 'mongoose';
const { Schema } = mongoose;

const companySchema = new Schema({
  urlName: { type: String },
  fantasyName: { type: String, required: true },
  slogan: String,
  description: String,
  whatsapp: String,
  active: { type: Boolean, default: true },
  owner: {
    name: { type: String, required: true },
    telefone: { type: String },
    email: { type: String },
    sexo: String,
  },
  login: {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
  delivery: { active: Boolean, priceKm: Number },
  custom: {
    logo: { url: String, id: String },
    googleMapUrl: String,
    gallery: [{ url: String, id: String }]
  },
  paymentsMethods: [{ id: String, title: String }],
  paymentOnline: { credentialsMP: { publicKey: String, accessToken: String } },
  subscription: { endpoint: String, keys: { p256dh: String, auth: String } }
}); 

export default mongoose.model('companies', companySchema);
