const mongoose = require('mongoose')
const Schema = mongoose.Schema


let ProfileShema = new Schema({
    IDuser:{
        type:mongoose.Schema.Types.ObjectId,
        
    },
    // image:{
    //     data:Buffer  ,
    //     contentType:String
    //     // type:String

    // },
    image:String,
    time:{
        type: Date, default: Date.now
    }
})

const profile = mongoose.model('profile' , ProfileShema);
module.exports = profile