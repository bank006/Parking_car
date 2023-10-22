const mongoose = require('mongoose')
const Schema = mongoose.Schema


let paymentSchema = new Schema({

    recipientType: {
        type: String,
        required: true,
        enum: ['mobile', 'nationalId', 'eWallet'], // ประเภทผู้รับ (อาจมีค่าได้คือ 'mobile', 'nationalId', 'eWallet' หรืออื่น ๆ)
      },
      recipientValue: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
      },
      imageQR:{
        type :String,
        required :[true]
      },
      IDbooking :{
        type:mongoose.Schema.Types.ObjectId,
        required:[true]
      },
      reference :{
        type:String,
        required:[true]
      },
      paymentDate: {
        type: Date,
        required: true,
        default: Date.now,
      },
    });

const payment = mongoose.model('payment', paymentSchema);
module.exports = payment;
