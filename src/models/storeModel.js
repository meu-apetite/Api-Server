import mongoose from 'mongoose'
const { Schema } = mongoose

const storeSchema = new Schema({
  nameOwner: String,
  name: String,
  description: String,
  email: String,
})

const Store = mongoose.model('store', storeSchema)
export default Store
