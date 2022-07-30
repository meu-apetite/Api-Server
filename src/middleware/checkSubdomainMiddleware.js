import Company from '../models/CompanyModel.js';

export default async (req, res, next) => {
  const path = req.path.split('/');
  path.shift();

  if (path.length <= 0) {
    const subdomain = path[0];
    const company = await Company.findOne({ subdomain });
  }

  next();
};
