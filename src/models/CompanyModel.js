import mongoose from 'mongoose';
const { Schema } = mongoose;

const stringRequired = { type: String, required: true };
const stringRequiredUniqueIndex = {
  type: String,
  required: true,
  unique: true,
};
const numberTrimLowercase = { type: String, lowercase: true, trim: true };

const companySchema = new Schema({
  nameOwner: stringRequired,
  nameCompany: stringRequired,
  subdomain: stringRequiredUniqueIndex,
  descriptionCompany: String,
  email: stringRequiredUniqueIndex,
  password: stringRequired,
  active: Boolean,

  address: {
    city: numberTrimLowercase,
    street: numberTrimLowercase,
    district: numberTrimLowercase,
    number: Number,
    zipCode: { type: Number, maxLength: 8 },
  },

  custom: {
    colorPrimary: String,
    colorSecudary: String,
    logoImg: String,
  },

  products: {
    product_id: String,
  },
});

const Company = mongoose.model('company', companySchema);
export default Company;
