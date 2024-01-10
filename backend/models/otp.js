const mongoose = require('mongoose')
const Schema = mongoose.Schema


let OTPschema = new Schema({
    email: {
        type : String,
        required : [true]
    },
    otp:{
       type: Number,
       required:[true]
    }
})


const otp = mongoose.model('otp' , OTPschema)
module.exports= otp