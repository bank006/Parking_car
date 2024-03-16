const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Reviewschema = new Schema({
    IDuser :{
        type:mongoose.Schema.Types.ObjectId 
    },
    IDproduct:{
        type:mongoose.Schema.Types.ObjectId 
    },
    ratingscore:{
        type:Number,
    }
})

const review = mongoose.model('review' ,  Reviewschema)
module.exports=review;