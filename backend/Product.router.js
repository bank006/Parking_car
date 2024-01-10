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
let store = require('./models/store');
const product = require('./models/product');
const { default: axios } = require('axios');

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
    const quantityInStockrel = req.body.quantityInStockrel;
    const latitude = req.body.latitude;
    const longitude =req.body.longitude;

    const point = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };
    const location = point ; 
    

    try{
        ProductShema.create({ imageProduct : imageProduct , IDstore : IDstore , nameProduct : nameProduct , priceProduct : priceProduct , descriptionProduct : descriptionProduct , quantityInStock : quantityInStock ,quantityInStockrel:quantityInStockrel, location : location , booking : false })
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

router.get('/callproduct/:IDproduct' , async(req ,res)=>{
    let recallproduct = await ProductShema.findOne({_id : (req.params.IDproduct)})
    res.status(200).json(recallproduct)
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

router.put('/updatepostbooking/:IDproductregiss', (req , res)=>{
    ProductShema.findByIdAndUpdate({_id : req.params.IDproductregiss},{ $inc: { quantityInStock: -1 } })
    .then((ress)=>{
        res.status(200).json(ress)
    }).catch((err)=>{
        res.send(err)
        console.log(err)
    })
})

router.put('/updatestock/:IDproduct' ,(req , res)=>{
    ProductShema.findByIdAndUpdate(
        { _id: req.params.IDproduct },
        { $inc: { quantityInStock: + 1 } },
        { new: true } // เพื่อให้ได้ข้อมูลที่อัพเดตแล้วกลับมา
    )
    .then((updatedProduct) => {
        res.status(200).json(updatedProduct);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    });
});



router.delete('/deleteproduct/:IDproduct' , (req , res)=>{
    const {IDproduct} = req.params
    ProductShema.findByIdAndDelete({_id : IDproduct})
    .then((deleteproduct)=>{
        res.status(200).json(deleteproduct)
    }).catch((err)=>{
        res.send(err)
    })
})


const storage = multer.diskStorage({
    destination:(req , file , cb)=>{
        cb(null , '../public/imageproduct')
    },
    filename:(req , file , cb)=>{
        cb(null , file.originalname)
    },
})

const upload = multer({ storage: storage });
router.put('/updateproduct', upload.single('newImage'), (req, res) => {
    const { IDproduct, namepr, qtypr } = req.body;
    const newImage = req.file.filename;
    console.log(IDproduct, newImage, namepr, qtypr);
    ProductShema.findByIdAndUpdate({_id : IDproduct} , {$set:{nameProduct:namepr , quantityInStock :qtypr , imageProduct:newImage}})
    .then((resupdate)=>{
        res.status(200).json({ message: 'File uploaded successfully' ,resupdate });
    }).catch((err)=>{
        res.send(err)
    })
    // ทำสิ่งที่คุณต้องการกับข้อมูลที่ได้รับ
    
});

router.put('/nonimg', (req, res) => {
    // รับข้อมูลที่ส่งมาจาก client
    const { IDproduct, namepr, qtypr } = req.body;
    ProductShema.findByIdAndUpdate({_id:IDproduct}, {$set:{nameProduct:namepr , quantityInStock :qtypr}}).
    then((ress)=>{
        res.json({ message: 'Update successful', ress });
    }).catch((err)=>{
        console.log(err)
    })    
  });
  


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

router.get('/nearlocation', (req, res) => {
    const yourLongitude = req.query.longitude;
    const yourLatitude = req.query.latitude;

    // ต่อไปนี้คือโค้ดที่เรียกใช้ Mongoose เพื่อค้นหาสินค้าใกล้เคียง
    ProductShema.find({
        location: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [yourLongitude, yourLatitude]
                },
                $maxDistance: 1000  // ระยะทางเป็นเมตร (1 กิโลเมตร)
            }
        }
    })
    .then((near) => {
        if (!near || near.length === 0) {
            res.json(near);
        } else {
            res.json(near);
        }
    })
    .catch((err) => {
        res.json(err);
    });
});

// router.put('/putview/:IDproductregishis ' ,(req ,res)=>{
//     const {IDproductregishis} = req.params
//     console.log(IDproductregishis)
// })

router.put('/putview/:IDproductregishis' ,(req ,res)=>{
    const {IDproductregishis} = req.params
    ProductShema.findByIdAndUpdate({_id:IDproductregishis},{$inc:{viewstore : + 1}})
    .then((view)=>{
        res.send(view)
    }).catch((err)=>{
        res.send(err)
    })
  })
  











module.exports =  router ;