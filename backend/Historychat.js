const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();


router.use(cors());
router.use(express.json());


let Historychatschema = require('./models/historychat');

router.get('/', (req, res) => {
    Historychatschema.find((err, data) => {
        if (err) {
            return next(err)
        } else {
            console.log(data)
            res.status(200).send(data)
        }
    })
})

router.get('/gethistorychat/:IDstorechat/:IDuserchat',(req , res)=>{
    const IDstorechat = req.params.IDstorechat;
    const IDuserchat = req.params.IDuserchat;
    Historychatschema.aggregate([
        {
            $match: {
                IDstorechat: mongoose.Types.ObjectId(IDstorechat),
                IDuserchat: mongoose.Types.ObjectId(IDuserchat)
            }
        }
    ]).then((historychat)=>{
        res.send(historychat)
    }).catch((err)=>{
        res.send(err)
    })
})


router.get('/getchatstore/:IDuser',(req , res)=>{
    const IDuser = req.params.IDuser;
    const User = require('./models/users')
    const Store = require('./models/store')
    Historychatschema.aggregate([
        {
            $match: {
                IDuser: mongoose.Types.ObjectId(IDuser)
            }
        },{
            $lookup:{
                from: User.collection.name , localField:'IDuser' ,foreignField:"_id" , as:'user'
            }
        },{
            $lookup:{
                from: Store.collection.name , localField:'IDstore' ,foreignField:"_id" , as:'store'
            }
        }
    ]).then((historychat)=>{
        res.send(historychat)
    }).catch((err)=>{
        res.send(err)
    })
})

router.get('/getchatuser/:IDstores',(req , res)=>{
    const IDstores = req.params.IDstores;
    const User = require('./models/users')
    const Store = require('./models/store')
    Historychatschema.aggregate([
        {
            $match: {
                IDstore: mongoose.Types.ObjectId(IDstores)
            }
        },{
            $lookup:{
                from: User.collection.name , localField:'IDuser' ,foreignField:"_id" , as:'user'
            }
        },{
            $lookup:{
                from: Store.collection.name , localField:'IDstore' ,foreignField:"_id" , as:'store'
            }
        }
    ]).then((historychat)=>{
        res.send(historychat)
    }).catch((err)=>{
        res.send(err)
    })
})


router.post('/posthistorychat' , (req , res)=>{
    Historychatschema.create(req.body, (err, rescard) => {
        if (!err) {
            res.status(200).json(rescard)
        } else {
            console.status(200).log(err)
        }
    })
})



module.exports = router;