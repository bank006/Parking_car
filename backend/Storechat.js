const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();

router.use(cors());
router.use(express.json());

let Storechatschema = require('../backend/models/storeuser_chat');

router.get('/', (req, res) => {
    Storechatschema.find((err, data) => {
        if (err) {
            return next(err)
        } else {
            console.log(data)
            res.status(200).send(data)
        }
    })
})

router.post('/storechatpost', (req, res) => {
    Storechatschema.create(req.body)
        .then((storechat) => {
            if (!storechat) {
                res.send('error create booking history')
            } else {
                res.send(storechat)
            }
        }).catch((err) => {
            res.send(err)
        })
})

router.get('/getstorebyid/:storeregis',(req , res)=>{
    const store = require('./models/store')
    Storechatschema.aggregate([{$match : {IDstore: mongoose.Types.ObjectId(req.params.storeregis)}},
        {$lookup:{from: store.collection.name , localField:'IDstore' , foreignField: "_id", as: 'store' }}
    ]).then((storebyid)=>{
        res.send(storebyid)
    }).catch((err)=>{
        res.send(err)
    })
})

router.get('/getstore',(req , res)=>{
    const store = require('./models/store')
    Storechatschema.aggregate([{$lookup:{from: store.collection.name , localField:'IDstore' , foreignField: "_id", as: 'store' }}])
    .then((stores)=>{
        res.send(stores)
    }).catch((err)=>{
        res.send("Error", err)
    })
})



module.exports = router;

