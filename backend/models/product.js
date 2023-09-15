const mongoose = require('mongoose')
const Schema = mongoose.Schema


let ProductShema = new Schema({
    IDstore:{
       type:mongoose.Schema.Types.ObjectId 
    },
    imageProduct:String,
    nameProduct: {
        type : String,
    },
    priceProduct: Number,
    descriptionProduct:String,
    quantityInStock:Number,
    // latitude: {
    //     type: String
    // },
    // longitude:{
    //     type: String
    // },
    location: {
        type: {
            type: String,
            enum: ['Point'], // ใช้ enum เพื่อกำหนดว่าเป็น Point
            required: true
        },
        coordinates: {
            type: [Number], // ใช้ Array ของเลขทศนิยมสองตำแหน่ง [longitude, latitude]
            required: true
        }
    },
    booking :{
        type: Boolean
    },
    timeproduct:{
        type: Date, default: Date.now
    }
})

ProductShema.index({ location: '2dsphere' });
const product = mongoose.model('product' , ProductShema);
module.exports = product;
