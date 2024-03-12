import mongoose from 'mongoose';

const localUri = 'mongodb://localhost:27017/meuapetite';

mongoose.connect(localUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('mongodb: ok'))
  .catch((error) => console.error('Error conn mongodb:', error));
