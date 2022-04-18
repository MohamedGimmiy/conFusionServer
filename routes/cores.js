const express = require('express');

const cors = require('cors');

const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost3443'];

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.headers('Origin'));
    if(whitelist.indexOf(req.headers('Origin'))!== -1){
        corsOptions = {origin: true};
    }
    else {
        corsOptions = {origin: false};
    }
    callback(null , corsOptions);
}


exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
