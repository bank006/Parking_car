const mongoose = require('mongoose')
const Schema = mongoose.Schema

let CancleSchema = new Schema({
    IDproduct:{
        type:mongoose.Schema.Types.ObjectId,
    },
    IDuser:{
        type:mongoose.Schema.Types.ObjectId,
    }
})

const cancleschema = mongoose.model('cancle' , CancleSchema)
module.exports=cancleschema;