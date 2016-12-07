module.exports = function(params) {
  var app = params.app;
  var logger = params.logger;
  var module = {};

  var passport = require('passport');
  var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
  var request = require('request');
  var auth = require('./middlewares/authorization');
  /*
   * Route middlewares
   */
  var sessionAuth = [auth.requiresLogin, auth.session.hasAuthorization];


  var env = {
    AUTH0_CLIENT_ID: params.config.auth0.client_id,
    AUTH0_DOMAIN: params.config.auth0.domain,
    AUTH0_CALLBACK_URL: params.config.auth0.callback
  };

  app.all("*", function(req, res, callback) {
    // added logging to track the API calls that are being made
    if ('/healthcheck.html' === req.url) {
      return callback();
    }

    logger.debug({ method: req.method, url: req.url, remoteAddress: (req.headers['x-forwarded-for'] || req.connection.remoteAddress), headers: req.headers, body: req.body, params: req.params, query: req.query });
    return callback();
  });

  /* GET home page. */
  app.get('/', function(req, res, next) {
    if (!req.user) {
      res.render('index', { env: env });
    } else {
      console.log(req.user);
      res.redirect("/polls");
    }
  });

  app.get('/login',
    passport.authenticate('auth0', {}), function (req, res) {
    res.redirect("/");
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/polls', ensureLoggedIn, function(req, res) {
    request('http://elections.huffingtonpost.com/pollster/api/charts.json?topic=2016-president', function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var polls = JSON.parse(body);
        res.render('polls', { user: req.user, polls: polls });
      } else {
        res.render('error');
      }
    });
  });

  app.get('/user', ensureLoggedIn, function(req, res, next) {
    res.render('user', { user: req.user });
  });

  app.get((params.config.auth0.callback_path),
    passport.authenticate('auth0', { failureRedirect: '/login' }),
    function(req, res) {
      console.log('passport.authenticate() req: ');
      console.log(req);
      if (!req.user) {
        throw new Error('user null');
      }

      res.redirect(req.session.returnTo || '/polls');
    });

  return module;
};