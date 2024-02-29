const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();
const multer = require('multer')
const path = require('path')
const argon2 = require('argon2');

router.use(cors());
router.use(express.json());

let StoreShema = require('./models/store');

router.get('/', (req,res)=>{
    StoreShema.find((err,data)=>{
        if(err){
            return next(err)
        }else{
            console.log(data)
            res.status(200).send(data)
        }
    })
})


const StorageStore = multer.diskStorage({
    destination:(req , file , cb)=>{
        cb(null , '../public/imagestore')
    },
    filename:(req , file , cb)=>{
        cb(null , file.originalname)
    },
})


const uploadstore = multer({storage : StorageStore})

router.post('/poststore', uploadstore.single('imageStores') ,(req ,res ,next)=>{
    const IDuser = req.body.IDuser;
    const nameStore = req.body.nameStore;
    const provin = req.body.provin;
    const description = req.body.description;
    const imageStores = req.file.filename;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    try{
        StoreShema.create({IDuser : IDuser , nameStore: nameStore , provin : provin , description : description , imageStores : imageStores , latitude: latitude , longitude : longitude })
        res.status(200).json({status : ok })
    }catch(error){
        res.status(200).json({status : error})
    }
})


router.get('/getstore/:IDuser' ,async (req , res , next)=>{
    const IDuser = req.params.IDuser
    let getstore = await  StoreShema.findOne({IDuser : (req.params.IDuser)})
    res.status(200).json(getstore)
})

router.get('/loginstore/:IDstore' , async (req , res ,next)=>{
    const IDstore = req.params.IDstore
    let loginstore = await StoreShema.findOne({_id: (req.params.IDstore) })
    res.status(200).json(loginstore)
})

router.put('/putview',(req , res)=>{
    const {IDstore} = req.body
    StoreShema.findByIdAndUpdate({_id : IDstore} , {$inc : {numofview : + 1}})
    .then((resputview)=>{
        res.send(resputview)
    }).catch((err)=>{
        res.send(err)
    })
})



module.exports =  router ;