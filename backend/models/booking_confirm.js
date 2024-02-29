const mongoose = require('mongoose')
const Schema = mongoose.Schema

let BookingconSchema = new Schema({
    IDbooking:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true]
    },
    IDproductregiscon :{
        type:mongoose.Schema.Types.ObjectId,
        required:[true]
    },
    IDusercon:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true]
    },
    storeregiscon:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true]
    },
    timebookingcon:{
        type:String,
        required:[true]
    },
    startbookingtime:{
        type:String,
        required:[true]
    },
    bookingtimecon:{
        type: Date, default:Date.now
    },
    statuspayment:{
        type: Boolean,
        required:[true]
    },
    parkingbox:{
        type:Number
    },
    contime:{
        type: Date, default:Date.now
    }
})

const bookingcon = mongoose.model('bookingcon', BookingconSchema )
module.exports=bookingcon