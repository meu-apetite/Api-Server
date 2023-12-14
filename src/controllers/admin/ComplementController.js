import Model from '../../models/ComplementModel.js';

class ComplementController {
  async getAll(req, res) {
    try {
      const complements = await Model.find();
      return res.status(200).json(complements);
    } catch (error) {
      console.log(error);
    }
  }

  async create(req, res) {
    try {
      const companyId = req.headers.companyid;
      const data = [...req.body];
      const errors = [];

      data.forEach((item, index) => {
        const options = [...item.options];
        let optionErrors = 0;

        if (!item?.name.trim().length) errors.push('O nome do complemento não pode ficar em branco');
        if (item?.isRequired) {
          if (item?.min < 0) errors.push('Quantidade mínima inválida');
          if (item?.max <= 0) errors.push('Quantidade máxima deve ser igual ou maior que 1');
        }

        options.forEach((option, i) => {
          if (!option?.name.trim().length) optionErrors++;
        });

        if (optionErrors) errors.push(
          'O nome da opção de complemento não pode ficar em branco.'
          + 'Verifique suas opções do complemento '
          + item.name
        );

        data[index]['company'] = companyId;
      });

      if (errors.length) return res.status(200).json({ success: false, message: errors.join('. \n ') });

      const complements = await Model.insertMany(data);

      if (complements.length == 0) return res.status(200).json(complements[0]);

      const ids = complements.map(doc => doc._id);

      return res.status(200).json(ids);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: 'Falha na requisição, tente novamente mais tarde' });
    }
  }

  async udpadte(req, res) {
    try {
      const companyId = req.headers.companyid;
      const data = [...req.body];
      const errors = [];
      const ids = [];

      data.forEach((item, index) => {
        const options = [...item.options];
        let optionErrors = 0;

        if (!item?.name.trim().length) errors.push('O nome do complemento não pode ficar em branco');
        if (item?.isRequired) {
          if (item?.min < 0) errors.push('Quantidade mínima inválida');
          if (item?.max <= 0) errors.push('Quantidade máxima deve ser igual ou maior que 1');
        }

        options.forEach((option, i) => {
          if (!option?.name.trim().length) optionErrors++;
        });

        if (optionErrors) errors.push(
          'O nome da opção de complemento não pode ficar em branco.'
          + 'Verifique suas opções do complemento '
          + item.name
        );

        data[index]['company'] = companyId;
      });

      if (errors.length) return res.status(200).json({ success: false, message: errors.join('. \n ') });

      data.forEach(async (complement) => {
        const result = await Model.findByIdAndUpdate(complement._id, complement, { new: true });
        ids.push(result._id);
      });

      return res.status(200).json(ids); 
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: 'Falha na requisição, tente novamente mais tarde' });
    }
  }
}

export default ComplementController;
