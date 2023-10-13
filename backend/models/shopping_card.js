const mongoose = require('mongoose')
const Schema = mongoose.Schema

let ShoppingcardShema = new Schema({

    IDproductregis :{
        type:mongoose.Schema.Types.ObjectId,
        required:[true]
    },
    IDuser:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true]
    },
    storeregis:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true]
    }
})

const shoppingcard = mongoose.model('shoppingcard' ,ShoppingcardShema)
module.exports = shoppingcard