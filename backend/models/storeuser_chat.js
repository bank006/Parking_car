const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Storechatschema = new Schema({
    IDstore:{
        type:mongoose.Schema.Types.ObjectId 
    }
})


const storechat = mongoose.model('storechat', Storechatschema)
module.exports = storechat