const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();

router.use(cors());
router.use(express.json());

let BookinghisSchema = require('./models/booking_history')


router.get('/', (req, res) => {
    BookinghisSchema.find((err, data) => {
        if (err) {
            return next(err)
        } else {
            console.log(data)
            res.status(200).send(data)
        }
    })
})

router.post('/posthistory', (req, res) => {
    BookinghisSchema.create(req.body)
        .then((reshistory) => {
            if (!reshistory) {
                res.send('error create booking history')
            } else {
                res.send(reshistory)
            }
        }).catch((err) => {
            res.send(err)
        })
})

router.get('/gethistory/:IDuser', (req, res) => {
    const Product = require('./models/product')
    const Store = require('./models/store')
    BookinghisSchema.aggregate([{ $match: { IDuserhis: mongoose.Types.ObjectId(req.params.IDuser) } },
    { $lookup: { from: Product.collection.name, localField: 'IDproductregishis', foreignField: '_id', as: 'product' } },
    { $lookup: { from: Store.collection.name, localField: 'storeregishis', foreignField: '_id', as: 'store' } },

    ])
        .then((datahistory) => {
            res.send(datahistory);
        }).catch((err) => {
            res.send(err)
        })
})

router.get('/history/:IDstore', (req, res) => {
    const Product = require('./models/product')
    const Store = require('./models/store')
    const User = require('./models/users')
    BookinghisSchema.aggregate([{ $match: { storeregishis: mongoose.Types.ObjectId(req.params.IDstore) } }
        , { $lookup: { from: Store.collection.name, localField: 'storeregishis', foreignField: '_id', as: 'store' } },
    { $lookup: { from: Product.collection.name, localField: 'IDproductregishis', foreignField: '_id', as: 'product' } },
    { $lookup: { from: User.collection.name, localField: 'IDuserhis', foreignField: '_id', as: 'users' } }
    ]).then((reshitory) => {
        res.send(reshitory)
    }).catch((err) => {
        res.send(err)
    })
})

router.get('/detail/:IDbookinghis', (req, res) => {
    const Product = require('./models/product')
    const Store = require('./models/store')
    const Payment = require('./models/qr-prompay')
    BookinghisSchema.aggregate([{ $match: { IDbookinghis: mongoose.Types.ObjectId(req.params.IDbookinghis) } },
    { $lookup: { from: Product.collection.name, localField: 'IDproductregishis', foreignField: '_id', as: 'product' } },
    { $lookup: { from: Store.collection.name, localField: 'storeregishis', foreignField: '_id', as: 'store' } },
    {$lookup:{from:Payment.collection.name , localField:'IDbookinghis' , foreignField:'IDbooking' , as:'payment'}}
    ]).then((resd) => {
        res.send(resd)
    }).catch((err) => {
        res.send(err)
    })
})

router.delete('/deletebookinghis/:IDproduct', (req, res) => {
    BookinghisSchema.deleteMany({ IDproductregishis: req.params.IDproduct })
        .then((data) => {
            if (!data) {
                res.send('error delete booking history')
            } else {
                res.send(data)
            }
        }).catch((errs) => {
            res.send(errs)
        })
})


router.get('/gethis/:IDuser', (req, res) => {
    BookinghisSchema.aggregate([
        { $match: { IDuserhis: mongoose.Types.ObjectId(req.params.IDuser) } },
        {
            $group: {
                _id: "$IDproductregishis", // เปลี่ยน "your_id_field" เป็นชื่อฟิลด์ที่มีไอดี
                count: { $sum: 1 }
            }
        }
    ]).then((result) => {
        res.send(result)
    });

})

router.put('/updatestatus/:idbooking', (req, res) => {
    const { idbooking } = req.params
    BookinghisSchema.updateOne({ IDbookinghis: idbooking }, { $set: { statuspayment: false } })
        .then((statuspaymentupdate) => {
            res.send(statuspaymentupdate)
        }).catch((err) => {
            res.send(err)
        })
})



module.exports = router; 