const mongoose = require('mongoose')
const Schema = mongoose.Schema

let EmployeeShema =new Schema({
    firstname:{
        type:String,
        required:[true]
    },
    lastname:{
        type:String,
        required:[true]
    },
    email:{
        type:String,
        required:[true]
    },
    passworduser:{
        type:String,
        required:[true]
    },
    users_id:{
        type:String,
        required:[true]
    }
})

const employee = mongoose.model('employee' , EmployeeShema)
module.exports = employee