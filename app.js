var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

var log = require('./logger.js');
var default_path = 'config/env.default.json'
var env_path = 'config/env.json'
var update_env = require('./update_env.js')(default_path, env_path);

update_env.update_config(function(err, config) {
  if (err) {
    throw err
  } else {

    if (!log.startLogger(config.logger)) {
      process.exit(-1);
    }

    config.auth0.callback = 'http://localhost:' + config.server.port + config.auth0.callback_path

    var logger = log.getLogger();
    logger.debug('Server started with the following config:');
    logger.debug(config);

    // This will configure Passport to use Auth0
    var strategy = new Auth0Strategy({
      domain: config.auth0.domain,
      clientID: config.auth0.client_id,
      clientSecret: config.auth0.client_secret,
      callbackURL: config.auth0.callback
    }, function(accessToken, refreshToken, extraParams, profile, done) {
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
      return done(null, profile);
    });

    passport.use(strategy);

    // you can use this section to keep a smaller payload
    passport.serializeUser(function(user, done) {
      console.log('passport.serializeUser: ');
      console.log(user);
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      console.log('passport.deserializeUser: ');
      console.log(user);
      done(null, user);
    });

    var app = express();
    var params = {
      app: app,
      config: config,
      logger: logger
    }

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));

    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(session({
      secret: config.session.secret,
      resave: true,
      saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(path.join(__dirname, 'public')));

    require('./routes.js')(params);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handlers
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        status: err.status
      });
    });

    app.listen(config.server.port);

  }
});