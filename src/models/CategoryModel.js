import mongoose from 'mongoose';
const { Schema } = mongoose;

const variationsSchema = new Schema({
  _idCompany: String,
  title: String,
});

export default mongoose.model('category', variationsSchema);