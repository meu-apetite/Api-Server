export default (req, res, next) => {
<<<<<<< HEAD
  // if (!req.user) {
  //   const message = JSON.stringify([
  //     {
  //       type: 'error',
  //       text: 'Faça o login para continuar',
  //     },
  //   ]);

  //   return res.redirect(`/test/login?messages=${message}`);
  // }
=======
  const subdomain = req.path.split('/')[1];
  if (!req.user) return res.redirect(`/${subdomain}/login`);

>>>>>>> b3947ca1aa74bee1a01dff04d854a6ebe838a943
  next();
};
