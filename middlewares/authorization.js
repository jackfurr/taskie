/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  if (req.method === 'GET') {
    req.session.returnTo = req.originalUrl;
  }

  res.redirect('/login');
};

/*
 *  User authorization routing middleware
 */

exports.userinfo = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/hasAuthorization/users/' + req.profile.id);
    }
    next();
  }
};

/*
 *  Article authorization routing middleware
 */

exports.session = {
  hasAuthorization: function (req, res, next) {
    if (req.session.user.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/hasAuthorization/session/' + req.session.id);
    }
    next();
  }
};

