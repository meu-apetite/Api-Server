export default (req, res, next) => {
  const subdomain = req.path.split('/')[1];
  if (!req.user) return res.redirect(`/${subdomain}/login`);

  next();
};
