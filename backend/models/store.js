const mongoose = require('mongoose')
const Schema = mongoose.Schema

let StoreShema = new Schema({
    IDuser:{
        type:String,
        required: [true]
    },
    nameStore :{
        type: String,
        required:[true]
    },
    provin:{
        type: String
    },
    description:{
        type: String
    },
    numofview:{
        type: Number,
        default: 0
    },
    imageStores: String,
    latitude: {
        type: String
    },
    longitude:{
        type: String
    },
    time_setup :{
        type: Date,
        default:Date.now,
    }
})



const store = mongoose.model('store', StoreShema)
module.exports = store