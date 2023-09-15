const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const argon2 = require('argon2');


let UserShema = new Schema({
    name:{
        type:String,
        required: [true , 'please enter your name']
    },

    email:{
        type: String,
        required : [true ,'please enter your email']
    },
    password:{
        type: String,
        required:[true, 'please enter your password' ]
    },
    passwordnh:{
        type : String,
        required:[true]
    },
    image: String,
    time:{
        type: Date, default:Date.now
    }
    
})

UserShema.pre('save'  , function(next){
    const user = this
    argon2.hash(user.password).then(hash => {
        user.password = hash
        next();
    }).catch(error => {
        console.log(error.errors);
    })
})


const users = mongoose.model('users', UserShema)
module.exports = users