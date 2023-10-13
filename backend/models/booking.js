const mongoose = require('mongoose')
const Schema = mongoose.Schema

let BookingSchema = new Schema({
 
    IDproductregis :{
        type:mongoose.Schema.Types.ObjectId,
        required:[true]
    },
    IDuser:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true]
    },
    storeregis:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true]
    },
    startbookingregis:{
        type:String,
        required:[true]
    },
    timeregis:{
        type:String,
        required:[true]
    },
    bookingtime:{
        type: Date, default:Date.now
    }
})
const booking = mongoose.model('booking' , BookingSchema)
module.exports = booking;