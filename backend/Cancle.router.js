const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();


router.use(cors());
router.use(express.json());

let CancleSchema = require('./models/cancle')

router.get('/', (req, res) => {
    CancleSchema.find((err, data) => {
        if (err) {
            return next(err)
        } else {
            console.log(data)
            res.status(200).send(data)
        }
    })
})


router.post('/postcancel' , (req , res)=>{
    CancleSchema.create(req.body, (err, rescard) => {
        if (!err) {
            res.status(200).json(rescard)
        } else {
            console.status(200).log(err)
        }
    })
})

// router.get('/getcancel/:IDuser',(req , res)=>{
//     CancleSchema.find({IDuser : req.params.IDuser})
//     .then((resget)=>{
//         res.status(200).send(resget)
//     }).catch((err)=>{
//         res.send(err)
//     })
// })


router.get('/getcancel/:IDuser',(req , res)=>{
    const Product  = require('./models/product')
    CancleSchema.aggregate([{$match :{IDuser : mongoose.Types.ObjectId(req.params.IDuser)}},
    {$lookup:{from:Product.collection.name , localField:'IDproduct' , foreignField: "_id" , as:'product' }}
    ])
    .then((resget)=>{
        res.status(200).send(resget)
    }).catch((err)=>{
        res.send(err)
    })
})


module.exports = router;