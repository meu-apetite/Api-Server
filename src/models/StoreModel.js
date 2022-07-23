import mongoose from 'mongoose';
const { Schema } = mongoose;

const storeSchema = new Schema({
  nameOwner: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  email: {
    type: String,
    required: true,
  },
});

const Store = mongoose.model('store', storeSchema);
export default Store;
