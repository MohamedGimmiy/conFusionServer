const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
    firstname:{
        type: String,
        default: ''
    },
    lastname:{
        type: String,
        default: '' 
    },
    facebookId : String,
    admin: {
        type: Boolean,
        default: false
    }
});

// add register function for signup and offers user & password in schema
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',User);