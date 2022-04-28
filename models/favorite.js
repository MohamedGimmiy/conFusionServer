const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Dish = require('./dishes')

const dishesSchema = new Schema({
    dish:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }
});

const FavoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[dishesSchema]
},{
    timestamps: true
});


var Farvorite = mongoose.model('Favorite', FavoriteSchema);

module.exports = Farvorite;