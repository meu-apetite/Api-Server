import mongoose from 'mongoose';

const uri =
  'mongodb+srv://superadmin:h5ikyi4Ofad7SCpb@cluster0.4zddaay.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri, {}).catch((error) => console.log(error));
