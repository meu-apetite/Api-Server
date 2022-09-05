import mongoose from 'mongoose';
const { Schema } = mongoose;

const variationsSchema = new Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company',
    require: true,
  },
  title: String,
  variations: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
        auto: true,
      },

      name: {
        type: String,
        required: true,
      }
    },
  ],
});

export default mongoose.model('variations', variationsSchema);
