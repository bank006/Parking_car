const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();
const multer = require('multer')
const path = require('path')
const argon2 = require('argon2');

router.use(cors());
router.use(express.json());

let BookingconSchema = require('./models/booking_confirm')


router.get('/', (req,res)=>{
    BookingconSchema.find((err,data)=>{
        if(err){
            return next(err)
        }else{
            console.log(data)
            res.status(200).send(data)
        }
    })
})

router.post('/postcon' , (req , res)=>{
    BookingconSchema.create(req.body,(err, resconbooking)=>{
        if(!err ){
            res.status(200).json(resconbooking)
        }else{
            console.log(err)
        }
    })
})

router.get('/getcon/:IDuser' , (req , res)=>{
//    console.log(req.params.IDuser)
   const Product = require('./models/product')
   const Store = require('./models/store')
   BookingconSchema.aggregate([{$match : {IDusercon : mongoose.Types.ObjectId(req.params.IDuser)}},
    {$lookup : {from: Product.collection.name , localField : "IDproductregiscon" , foreignField : "_id" , as: "product" }},
    {$lookup : {from: Store.collection.name , localField : "storeregiscon" , foreignField : "_id" , as: "store"}}

]).then((bookinf)=>{
    if(bookinf){
        res.status(200).json(bookinf)
    }else{
        res.status(200).json('error')
    }
}).catch((err)=>{
    res.status(200).json(err)
})
})

router.get('/findbooking/:IDproduct' , (req , res)=>{
    BookingconSchema.find({IDproductregiscon : req.params.IDproduct }).then((resf)=>{
        if(resf){
            res.status(200).json(resf)
        }else{
            res.status(200).json('error')
        }
        
    }).catch((err)=>{
        res.status(200).json(err)
    })
})

router.get('/getdate/:IDuser' , (req , res ,)=>{
    BookingconSchema.find({IDusercon : (req.params.IDuser)}, 'IDbooking  IDusercon IDproductregiscon timebookingcon startbookingtime statuspayment')
    .then((time)=>{
        res.status(200).send(time)
    }).catch((err)=>{
        res.status(200).send(err)
    })
})

router.delete('/cancelbookingcon/:id',(req , res)=>{
    console.log(req.params.id)
    BookingconSchema.findByIdAndDelete({_id:req.params.id})
    .then((cancel)=>{
        res.send(cancel)
    }).then((err)=>{
        res.send(err)
    })
})

router.delete('/delete/:idbookingcon' , (req , res)=>{
    BookingconSchema.findByIdAndDelete({_id: req.params.idbookingcon})
    .then((deletebooking)=>{
        res.send(deletebooking)
    }).catch((err)=>{
        res.send(err)
    })
})


module.exports = router ; 