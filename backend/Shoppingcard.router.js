const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();

router.use(cors());
router.use(express.json());

let ShoppingcardShema = require('./models/shopping_card')

router.get('/', (req, res, next) => {
    ShoppingcardShema.find((err, data) => {
        if (err) {
            return next(err)
        } else {
            console.log(data)
            res.status(500).send(data)
        }
    })
})

router.post('/postshoppingcard', (req, res, next) => {
    ShoppingcardShema.create(req.body, (err, rescard) => {
        if (!err) {
            res.status(200).json(rescard)
        } else {
            console.status(200).log(err)
        }
    })
})

router.get('/getcard/:IDuser', (req, res) => {
    const Product = require('./models/product')
    const Store = require('./models/store')
    ShoppingcardShema.aggregate([{ $match: { IDuser: mongoose.Types.ObjectId(req.params.IDuser) } },
    { $lookup: { from: Product.collection.name, localField: "IDproductregis", foreignField: "_id", as: 'product' } },
    { $lookup: { from: Store.collection.name, localField: "storeregis", foreignField: "_id", as: 'store' } }
    ]).then((card) => {
        if (card) {
            res.status(200).send(card)
        } else[
            res.status(200).send('error')
        ]
    }).catch((err) => {
        console.log(err)
    })

})

router.delete('/delete/:_id', (req, res) => {
    ShoppingcardShema.findByIdAndDelete({ _id: req.params._id })
        .then((results) => {
            res.status(200).send(results)
        }).catch((err) => {
            res.status(200).send(err)
        })
})

router.delete('/deletecard/:IDproductregis/:IDuser', async (req, res) => {
    const IDproductregis = req.params.IDproductregis;
    const IDuser = req.params.IDuser;

    try {
        // ค้นหาข้อมูลตาม ID ทั้งสอง
        const shoppingCardEntry = await ShoppingcardShema.findOne({
            IDproductregis: IDproductregis,
            IDuser: IDuser,
        });

        // ตรวจสอบว่ามีข้อมูลหรือไม่ก่อนที่จะลบ
        if (!shoppingCardEntry) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการลบ' });
        }

        // ลบข้อมูล
        await ShoppingcardShema.findByIdAndDelete(shoppingCardEntry._id);

        return res.status(200).json({ message: 'ลบข้อมูลเรียบร้อยแล้ว' });
    } catch (error) {
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
});

module.exports = router;