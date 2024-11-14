import mongoose from 'mongoose';

const uri = "mongodb+srv://test:gg83111761@cluster0.wz1xy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('mongodb: ok'))
  .catch((error) => console.error('Error conn mongodb:', error));
