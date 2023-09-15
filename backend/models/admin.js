const mongoose = require('mongoose')
const Schema = mongoose.Schema
const argon2 = require('argon2');

let Adminshema =new Schema({
    admin_name:{
        type:String,
        required: [true , 'please enter your name']
    },
    admin_email:{
        type:String,
        required:[true]
    },
    admin_password:{
        type: String,
        required:[true, 'please enter your password' ]
    },
    admin_passwordnh:{
        type : String,
        required:[true]
    },
    time:{
        type: Date, default: Date.now
    }
})

Adminshema.pre('save'  , function(next){
    const admin = this
    argon2.hash(admin.admin_password).then(hash => {
        admin.admin_password = hash
        next();
    }).catch(error => {
        console.log(error.errors);
    })
})

const admin = mongoose.model('admin', Adminshema)
module.exports = admin