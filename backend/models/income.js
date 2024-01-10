const mongoose = require('mongoose')
const Schema = mongoose.Schema


let incomeSchema = new Schema({
    IDbookinghis:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true]
    },
    IDproductregishis :{
        type:mongoose.Schema.Types.ObjectId,
        required:[true]
    },
    IDuserhis:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true]
    },
    storeregishis:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true]
    },
    timebookinghis:{
        type:String,
        required:[true]
    },
    bookingtimehis:{
        type: Date, default:Date.now
    },
    statuspayment:{
        type: Boolean,
        required:[true]
    },price:{
        type:Number,required:[true]
    }
})


const income = mongoose.model('income', incomeSchema )
module.exports=income