var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/users');


router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',(req,res,next)=>{
  // make sure it does not exist
  User.findOne({username:req.body.username})
  .then(user =>{
    if(user != null){
      var err= new Error('User ' + req.body.username + ' already exists');
      err.status = 403;
      next(err);
    }else{
      return User.create({
        username: req.body.username,
        password: req.body.password})
        .then(user=>{
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.json({status: 'Registeration Successfull!', user: user});
        },err=> next(err))
        .catch(err=>next(err))
    }
  })
  .catch(err=>next(err))
});


router.post('/login', (req,res,next)=>{
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

    User.findOne({username:username})
    .then(user=>{
      // if user does not exist
      if(user ==null){
        var err = new Error('User' + username + 'does not exist!');
        err.status = 403;
        return next(err);
      }
      // if password does not match
      else if(user.password !== password){
        var err = new Error('Your password is incorrect!');
        err.status = 403;
        return next(err);
      }
      // if both username and password match
      else if (user.username === username && user.password === password) {
        // pass to next middleware (you are allowed)
        // setup our signed session (  (user: admin) )
        req.session.user = 'authenticated';
        res.status = 200;
        res.setHeader('Content-Type','text/plain');
        res.end('You are authenticated!');
      }
    })
    .catch(err=>next(err))

  }
  else {
    res.status = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
});

router.get('/logout', (req,res,next)=>{
  // clear the session
  // clear the cookie
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err= new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
