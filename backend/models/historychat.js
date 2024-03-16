const mongoose = require('mongoose')
const Schema = mongoose.Schema


let Historychatschema = new Schema({
    IDuserchat: {
        type:mongoose.Schema.Types.ObjectId,
    },
    IDstorechat:{
        type:mongoose.Schema.Types.ObjectId,
    },
    IDuser:{
        type:mongoose.Schema.Types.ObjectId,
    },
    IDstore:{
        type:mongoose.Schema.Types.ObjectId,
    }
})

const historychatschema = mongoose.model('historychat' , Historychatschema)
module.exports= historychatschema;