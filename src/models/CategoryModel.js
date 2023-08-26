import mongoose from 'mongoose';
const { Schema } = mongoose;

const categoriesSchema = new Schema({ 
  _idCompany: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  }, 
  image: String 
});

export default mongoose.model('categories', categoriesSchema);