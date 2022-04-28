const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cores');
const Dishes = require('../models/dishes');


// Favorites router
const FavoriteRouter  = express.Router();

FavoriteRouter.use(bodyParser.json());

//1. adding favorites Done correctly
FavoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    //TODO filter by user favorites
    Favorite.find({user: req.user._id})
    .populate('user')
    .populate('dishes.dish')
    .then(favorite=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favorite);
    }, err=> next(err))
    .catch(err=> next(err));
})

// Done except make sure objects are unique
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=> {
    // For each dish insert it into favorites
    //TODO filter dishes if it exits in favorite list so do not add them
        // get the favorite json object of our user
        Favorite.findOneAndUpdate({user:req.user._id},{$push:{
            dishes: req.body}})
        .populate('dishes')
        .populate('user')
        .then(favorite =>{
            // user first create favorite document
            if(favorite){
                res.statusCode = 201;
                res.setHeader('Content-Type','application/json');
                res.json(favorite);
                next();
                return;
            }
            else {
                Favorite.create({
                    user: req.user._id,
                    dishes: req.body
                })
                .then(fav=>{
                    res.statusCode = 201;
                    res.setHeader('Content-Type','application/json');
                    res.json(fav);
                },err=>next(err))
                .catch(err=>next(err))
                
            }
        }, err=>next(err))
        .catch(err => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=> {
    res.statusCode = 403;
    res.end('PUT operation not supported on leaders');
})

//Done correctly delete favorites for a specific user
.delete(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
    Favorite.findOneAndRemove({user:req.user._id})
    .then(resp=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, err=> next(err))
    .catch(err=> next(err));
})

//2. favorites with id
//TODO GET a specific favorite element
FavoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req,res,next) => {
    Favorite.find({dish: req.params.dishId})
    .populate('dishes.dish')
    .populate('user')
    .then(favorite=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favorite);
    }, err=>next(err))
    .catch(err=>next(err));
})

//Done except make sure it does not exist
.post(cors.corsWithOptions, authenticate.verifyUser,(req,res,next)=> {
    Favorite.findOneAndUpdate({user:req.user._id},{$push:{
        dishes: {dish: req.params.dishId}}},{new : true})
    .populate('dishes.dish')
    .populate('user')
    .then(favorite =>{
        // user first create favorite document
        if(favorite){
            res.statusCode = 201;
            res.setHeader('Content-Type','application/json');
            res.json(favorite);
            next();
            return;
        }
        else {
            Favorite.create({
                user: req.user._id,
                dishes: req.body
            })
            .then(fav=>{
                res.statusCode = 201;
                res.setHeader('Content-Type','application/json');
                res.json(fav);
            },err=>next(err))
            .catch(err=>next(err))
            
        }
    }, err=>next(err))
    .catch(err => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=> {
    res.statusCode = 403;
    res.end('POST operation not supported on favorites/' + req.params.dishId);
})

// Done Delete a single item from array of objects using mongoose
.delete(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
    Favorite.findOneAndUpdate({user: req.user._id},{$pull:{dishes: {dish: req.params.dishId}}})
    .then(resp=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, err=> next(err))
    .catch(err=>{
        next(err);
    })
});

module.exports = FavoriteRouter;