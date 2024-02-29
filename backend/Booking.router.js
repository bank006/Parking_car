const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();


router.use(cors());
router.use(express.json());

let BookingSchema = require('./models/booking')

router.get('/', (req, res) => {
    BookingSchema.find((err, data) => {
        if (err) {
            return next(err)
        } else {
            console.log(data)
            res.status(200).send(data)
        }
    })
})


router.post('/postbooking', (req, res, next) => {
    const { IDproductregis, IDuser, storeregis, startbookingregis, timeregis, parkingbox } = req.body;
    const statuspayment = false
    BookingSchema.create({ IDproductregis, IDuser, storeregis, startbookingregis, timeregis, parkingbox, statuspayment }, (err, resbooking) => {
        if (!err) {
            res.status(200).json(resbooking)
        } else {
            console.log(err)
        }
    })
})


router.get('/getbooking/:IDuser', (req, res) => {
    BookingSchema.find({ IDuser: req.params.IDuser }, (err, data) => {
        if (data) {
            res.status(200).json(data)
        } else {
            console.log(err)
            res.json('not data')
        }

    })
})

router.get('/getbookingproduct/:IDproductregis', (req, res) => {
    BookingSchema.find({ IDproductregis: req.params.IDproductregis }, (err, data) => {
        if (data) {
            res.status(200).json(data)
        } else {
            console.log(err)
            res.json('not data')
        }
    })
})

router.get('/getbooking_product/:IDuser', (req, res) => {
    const Product = require('./models/product')
    const Store = require('./models/store')
    BookingSchema.aggregate([{ $match: { IDuser: mongoose.Types.ObjectId(req.params.IDuser) } },
    { $lookup: { from: Product.collection.name, localField: "IDproductregis", foreignField: "_id", as: 'product' } },
    { $lookup: { from: Store.collection.name, localField: "storeregis", foreignField: "_id", as: 'store' } }])
        .then((productres) => {
            if (productres) {
                res.status(200).send(productres)
            } else {
                res.status(200).send('error build table')
            }
        }).catch((err) => {
            console.log(err);
        })
})

router.get('/getdate/:IDuser', (req, res,) => {
    BookingSchema.find({ IDuser: (req.params.IDuser) }, 'bookingtime  IDuser IDproductregis')
        .then((time) => {
            res.status(200).send(time)
        }).catch((err) => {
            res.status(200).send(err)
        })
})

router.delete('/deletebooking/:_id', (req, res) => {
    const _id = req.params._id;
    BookingSchema.findByIdAndDelete({ _id: req.params._id })
        .then((results) => {
            res.status(200).send(results)
        }).catch((err) => {
            res.status(200).send(err)
        })
})


module.exports = router;
