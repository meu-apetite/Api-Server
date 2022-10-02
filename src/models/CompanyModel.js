import mongoose from 'mongoose';
const { Schema } = mongoose;

const companySchema = new Schema({
  urlName: { type: String },
  fantasyName: { type: String, required: true },
  description: String,
  whatsapp: String,
  active: { type: Boolean, default: true },
  owner: {
    name: { type: String, required: true },
    lastName: String,
    sexo: String,
  },
  login: {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  address: {
    city: { type: String, trim: true },
    street: { type: String, trim: true },
    district: { type: String, trim: true },
    zipCode: { type: Number, maxLength: 8 },
  },
  custom: {
    colorPrimary: String,
    colorSecudary: String,
    logo: {
      type: String,
      default: 'https://www.eps.org/global_graphics/default-store-350x350.jpg',
    },
    theme: {
      type: String,
      default: 'default',
    },
  },
});

export default mongoose.model('company', companySchema);
