export default (req, res, next) => {
  // if (!req.user) {
  //   const message = JSON.stringify([
  //     {
  //       type: 'error',
  //       text: 'Faça o login para continuar',
  //     },
  //   ]);

  //   return res.redirect(`/test/login?messages=${message}`);
  // }
  next();
};
