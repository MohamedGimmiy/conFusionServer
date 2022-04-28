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
    .populate('dishes')
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
        Favorite.find({user:req.user._id})
        .then(favorite => {
            if(favorite.length === 0 ){
                // insert all
                Favorite.create({
                    user : req.user._id,
                    dishes:[...req.body]
                })
                .then(fav=>{
                    res.statusCode = 201;
                    res.setHeader('Content-Type','application/json');
                    res.json(fav);
                    return;
                },err=>next(err))
                .catch(err=>next(err));
            }
            // extract not existed elements
            var uniqueElements = req.body.filter(item => !favorite[0].dishes.includes(item._id));
                console.log(favorite[0].dishes)
                console.log(req.body)
                    console.log('pushed')
                    console.log(uniqueElements)
                    const mapping = uniqueElements.map(ele => ele._id);
                    // if it does not exist
                    if(uniqueElements.length !== 0){
                        favorite[0].dishes.push(...mapping);
                        favorite[0].save()
                        .then(fav => {
                            res.statusCode = 201;
                            res.setHeader('Content-Type','application/json');
                            res.send(fav);
                        }, err=>next(err))
                        .catch(err=>next(err));
                    }else{
                        res.statusCode = 409;
                        res.setHeader('Content-Type','application/json');
                        res.send('Already exist');
                    }


        }, err=>next(err))
        .catch(err=>next(err));
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
    res.statusCode = 403;
    res.end('GET operation not supported on favorites/' + req.params.dishId);
})

//Done except make sure it does not exist
//TODO array of strings
.post(cors.corsWithOptions, authenticate.verifyUser,(req,res,next)=> {
    Favorite.find({user:req.user._id})
    .then(favorite => {
        if(favorite[0] === undefined){
            console.log('created')
            console.log(favorite)
            Favorite.create({
                user : req.user._id,
                dishes:[req.params.dishId]
            })
            .then(fav=>{
                res.statusCode = 201;
                res.setHeader('Content-Type','application/json');
                res.json(fav);
            },err=>next(err))
            .catch(err=>next(err));
        }
        else{
            console.log('pushed')
            // if it does not exist
            if(favorite[0].dishes.indexOf(req.params.dishId) == -1){
                favorite[0].dishes.push(req.params.dishId);
                favorite[0].save()
                .then(fav => {
                    res.statusCode = 201;
                    res.setHeader('Content-Type','application/json');
                    res.json(fav);
                }, err=>next(err))
                .catch(err=>next(err));
            } else{
                // already exist
                res.statusCode = 409;
                res.setHeader('Content-Type','application/json');
                res.send('Already exist')
            }
            
        }
    },err=>next(err))
    .catch(err=>next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=> {
    res.statusCode = 403;
    res.end('POST operation not supported on favorites/' + req.params.dishId);
})

// Done Delete a single item from array of objects using mongoose
.delete(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
    Favorite.findOneAndUpdate({user: req.user._id},{$pull:{dishes: req.params.dishId}})
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