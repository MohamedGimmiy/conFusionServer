const express = require('express');
const bodyParser = require('body-parser');

// promotion router
const promoRouter  = express.Router();

promoRouter.use(bodyParser.json());

//1. add promotions
promoRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    // to look for other end points that matches /promotions
    next();
})

.get((req,res,next) => {
    res.end('Will send all promotions to you!');
})

.post((req,res,next)=> {
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})

.put((req,res,next)=> {
    res.statusCode = 403;
    res.end('PUT operation not supported on promotions');
})

.delete((req,res,next) => {
    res.end('Deleting  all promotions!');
})

//2. promotion with id
promoRouter.route('/:promoId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    // to look for other end points that matches /promotions
    next();
})
.get((req,res,next) => {
    res.end('Will send details of the promotion: ' + req.params.promoId + ' to you!');
})

.post((req,res,next)=> {
    res.statusCode = 403;
    res.end('POST operation not supported on promotion/' + req.params.promoId);
})

.put((req,res,next)=> {
    res.write('Updating the promotion: ' + req.params.promoId + '\n');
    res.end('Will update the promotion: ' + req.body.name + ' with details ' + req.body.description);
})

.delete((req,res,next) => {
    res.end('Deleting  promotion: ' +req.params.promoId);
});

module.exports = promoRouter;