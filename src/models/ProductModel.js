import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company',
    require: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: String,
  price: {
    type: Number,
    required: true,
  },
  priceDiscount: {
    type: Number,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
    },
  ],
  variations: [
    {
      title: String,
      variants: { name: String, price: Number },
    },
  ],
  measurementUnits: [String],
  tags: [String],
  linkExternal: String,
  images: [
    {
      id: String,
      url: String,
    },
  ],
});

export default mongoose.model('product', productSchema);
