const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs')
const router = express();

router.use(cors());
router.use(express.json());
router.use('/images', express.static(path.join(__dirname, './public')));

let ProductShema = require('./models/product');
let store = require('./models/store')

router.get('/', (req,res)=>{
    ProductShema.find((err,data)=>{
        if(err){
            return next(err)
        }else{
            console.log(data)
            res.status(200).send(data)
        }
    })
})

const StorageProduct = multer.diskStorage({
    destination:(req , file , cb)=>{
        cb(null , '../public/imageproduct')
    },
    filename:(req , file , cb)=>{
        cb(null , file.originalname)
    },
})

const uploadproduct = multer({storage : StorageProduct})
router.post('/postproduct' , uploadproduct.single('imageProduct') , (req , res , next) =>{
    const IDstore = req.body.IDstore;
    const imageProduct = req.file.filename;
    const nameProduct = req.body.nameProduct;
    const priceProduct = req.body.priceProduct;
    const descriptionProduct = req.body.descriptionProduct;
    const quantityInStock = req.body.quantityInStock;
    const latitude = req.body.latitude;
    const longitude =req.body.longitude;

    const point = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };
    const location = point ; 
    

    try{
        ProductShema.create({ imageProduct : imageProduct , IDstore : IDstore , nameProduct : nameProduct , priceProduct : priceProduct , descriptionProduct : descriptionProduct , quantityInStock : quantityInStock , location : location , booking : false })
        res.status(200).json({status : ok })
    }catch(error){
        res.status(200).json({status : error})
    }
})

router.get('/getproduct/:IDstore' ,async (req , res ,next)=>{
    const IDstore = req.params.IDstore
    let productstore = await ProductShema.find({IDstore : IDstore})
    res.status(200).json(productstore)
})


router.get('/joinproduct' , (req , res )=>{
    const Store = require('./models/store')
    ProductShema.aggregate([{$lookup :{from: Store.collection.name , localField: "IDstore" , foreignField :"_id" , as:'store'}}])
    .then((storexproduct)=>{
        if(storexproduct){
            res.send(storexproduct)
        }
        else{
            res.send("Error buile table")
        }
    }).catch((error)=>{
        console.log(error);
    })
})


router.get('/getlocation/:location', async (req, res, next) => {
    const location = req.params.location;
    const maxDistance = 7000.0;
    const [longitude, latitude] = location.split(',').map(parseFloat);

    ProductShema.aggregate([
        {
            $geoNear: {
                near: { type: 'Point', coordinates: [longitude, latitude] },
                distanceField: 'distance',
                maxDistance: maxDistance,
                spherical: true
            }
        }
    ])
    .then((locationgeo) => {
        if (locationgeo.length > 0) {
            res.send(locationgeo);
        } else {
            res.send('No data found');
        }
    })
    .catch((error) => {
        console.log(error);
        res.send('An error occurred');
    });
});









module.exports =  router ;