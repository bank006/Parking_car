const mongoose = require('mongoose')
const Schema = mongoose.Schema


let BookinghisSchema = new Schema({
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
    },
    histime:{
        type: Date, default:Date.now
    }
})

const bookinghis = mongoose.model('bookinghis', BookinghisSchema )
module.exports=bookinghis
