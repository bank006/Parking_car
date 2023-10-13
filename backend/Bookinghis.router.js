const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();

router.use(cors());
router.use(express.json());

let BookinghisSchema = require('./models/booking_history')


router.get('/', (req,res)=>{
    BookinghisSchema.find((err,data)=>{
        if(err){
            return next(err)
        }else{
            console.log(data)
            res.status(200).send(data)
        }
    })
})

router.post('/posthistory' , (req , res)=>{
    BookinghisSchema.create(req.body)
    .then((reshistory)=>{
        if(!resizeBy){
            res.send('error create booking history')
        }else{
            res.send(reshistory)
        }
    }).catch((err)=>{
        res.send(err)
    })
})

router.get('/gethistory/:IDuser' ,(req , res)=>{
    const Product =  require('./models/product')
    const Store = require('./models/store')
    BookinghisSchema.aggregate([{$match : {IDuserhis : mongoose.Types.ObjectId(req.params.IDuser)}},
    {$lookup:{from:Product.collection.name ,localField:'IDproductregishis',foreignField:'_id',as: 'product'}},
    {$lookup:{from:Store.collection.name ,localField:'storeregishis',foreignField:'_id',as: 'store'}}])
    .then((datahistory)=>{
        res.send(datahistory)
    }).catch((err)=>{
        res.send(err)
    })
})


module.exports = router ; 