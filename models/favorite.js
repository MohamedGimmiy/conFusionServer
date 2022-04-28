const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Dish = require('./dishes')

/* const dishesSchema = new Schema({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
}); */

const FavoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[{type: String, ref:'Dish' }]
},{
    timestamps: true
});


var Farvorite = mongoose.model('Favorite', FavoriteSchema);

module.exports = Farvorite;