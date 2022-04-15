const express = require('express');
const bodyParser = require('body-parser');

// leader router
const leaderRouter  = express.Router();

leaderRouter.use(bodyParser.json());

//1. add leaders
leaderRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    // to look for other end points that matches /leaders
    next();
})

.get((req,res,next) => {
    res.end('Will send all leaders to you!');
})

.post((req,res,next)=> {
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})

.put((req,res,next)=> {
    res.statusCode = 403;
    res.end('PUT operation not supported on leaders');
})

.delete((req,res,next) => {
    res.end('Deleting  all leaders!');
})

//2. leader with id
leaderRouter.route('/:leaderId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    // to look for other end points that matches /leaders
    next();
})
.get((req,res,next) => {
    res.end('Will send details of the leader: ' + req.params.leaderId + ' to you!');
})

.post((req,res,next)=> {
    res.statusCode = 403;
    res.end('POST operation not supported on leaders/' + req.params.leaderId);
})

.put((req,res,next)=> {
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name + ' with details ' + req.body.description);
})

.delete((req,res,next) => {
    res.end('Deleting  leader: ' +req.params.leaderId);
});

module.exports = leaderRouter;