import mongoose from 'mongoose';

const localUri = 'mongodb://localhost:27017/meuapetite';

mongoose.connect(localUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexão com o MongoDB local bem-sucedida');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB local:', error);
  });
