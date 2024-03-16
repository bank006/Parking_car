const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Chatmessage = new Schema({
    IDuserchat: {
        type:mongoose.Schema.Types.ObjectId,
    },
    IDstorechat:{
        type:mongoose.Schema.Types.ObjectId,
    },
    message: String,
    status:String,
    timestamp: { type: Date, default: Date.now },
})

const chatmessage = mongoose.model('chatmassage', Chatmessage)
module.exports = chatmessage
