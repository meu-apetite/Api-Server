import mongoose from 'mongoose';
const { Schema } = mongoose;

const logSchema = new Schema({
  _idCompany: String,
  message: Schema.Types.Mixed,
  info: Schema.Types.Mixed,
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('logs', logSchema);