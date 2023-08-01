const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Adminshema =new Schema({
    admin_name:{
        type:String,
        required: [true , 'please enter your name']
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
    const user = this
    argon2.hash(user.admin_passwordpassword).then(hash => {
        user.admin_passwordpassword = hash
        next();
    }).catch(error => {
        console.log(error.errors);
    })
})

const admin = mongoose.model('admin', Adminshema)
module.exports = admin