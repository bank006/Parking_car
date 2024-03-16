const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Userchatschema = new Schema({
    IDuser:{
        type:mongoose.Schema.Types.ObjectId 
    }
})


const userchats = mongoose.model('userchats', Userchatschema)
module.exports = userchats