import mongoose from 'mongoose';
const { Schema } = mongoose;

const units = ['g', 'kg', 'mL', 'L', 'un', 'pct', 'cx', 'porc'];

const productSchema = new Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'companies',
    require: true
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'categories' ,
    require: true
  },
  complements: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'complements'
  }],
  name: {
    type: String,
    required: true,
  },
  description: String,
  code: String,
  price: {
    type: Number,
    required: true,
  },
  priceDiscount: Number,
  unit: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: (value) => units.includes(value),
      message: 'Unidade de medida inválida'
    }
  },
  isActive: Boolean,
  images: [{ url: String, id: String }]
});

export default mongoose.model('products', productSchema);
