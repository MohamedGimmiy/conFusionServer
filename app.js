var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport')
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');
var FavoriteRouter = require('./routes/favoritesRouter');
var commentRouter = require('./routes/commentRouter');

var app = express();
// redirect all traffic to secure server
app.all('*',(req,res,next) => {
  if(req.secure){
    return next();
  } // insecure port to be reditrected to our secure url
  else {
    // 307 is status to not to change the redirected req
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// providing a secret key to sign our cookies
// app.use(cookieParser('09876-12345-13567-97865'));

// using passport and passport-session
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)
app.use('/imageUpload', uploadRouter)
app.use('/favorites', FavoriteRouter)
app.use('/comments',commentRouter);

const mongoose = require('mongoose');
const Dishes = require('./models/dishes')
const Leaders = require('./models/leaders')
const Promotions = require('./models/promotions');

const url = config.mongoUrl;

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
