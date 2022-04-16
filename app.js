var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// providing a secret key to sign our cookies
// app.use(cookieParser('09876-12345-13567-97865'));

// setting up our session
app.use(session({
  name: 'session-id',
  secret : '09876-12345-13567-97865',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

function auth(req, res, next) {

  //console.log(req.signedCookies);
  console.log(req.session)
  // if user does not include cookie in headers
  // ask user to authenticate himself
  if (!req.session.user) {
    // request username and password from user
    var authHeader = req.headers.authorization;
    // user did not include username and password
    if (authHeader == null) {
      var err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }

    // decoding the base64 to extract username and password
    // from authorization: 'Basic YWRtaW46cGFzc3dvcmQ=' we split the Basic and the rest of string
    // then we decode the rest of the string and extract the info we want

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    if (username === 'admin' && password === 'password') {
      // pass to next middleware (you are allowed)
      // setup our signed session (  (user: admin) )
      req.session.user = 'admin';
      next();
    }
    else {
      var err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  }
  else {
    // user has a session setup
    if(req.session.user === 'admin'){
      next();
    } else{
      // cookie is not valid
      var err = new Error('You are not authenticated');
      err.status = 401;
      return next(err);
    }
  }

}

// Basic authentication
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)

const mongoose = require('mongoose');
const Dishes = require('./models/dishes')
const Leaders = require('./models/leaders')
const Promotions = require('./models/promotions');
const { signedCookies } = require('cookie-parser');

const url = "mongodb://localhost:27017/conFusion";

const connect = mongoose.connect(url);

connect.then(db => {
  console.log('connected correctly!');
}).catch(err => {
  console.log(err);
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
