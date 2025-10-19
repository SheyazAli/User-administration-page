
const checkSession = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/user/login');
  }
};

const isLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    res.redirect('/user/home');
  } else {
    next();
  }
};

module.exports = { checkSession, isLogin };
