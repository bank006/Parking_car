const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();


router.use(cors());
router.use(express.json());

let Reviewschema = require('./models/Review')

router.get('/', (req, res) => {
    Reviewschema.find((err, data) => {
        if (err) {
            return next(err)
        } else {
            console.log(data)
            res.status(200).send(data)
        }
    })
})

router.post('/postscoreReview', async (req, res, next) => {
    const IDproduct = req.body.IDproduct;
    const ratingscore = req.body.ratingscore;

    try {
        // ถ้ายังไม่มีรีวิวสำหรับสินค้านี้ ให้สร้างรีวิวใหม่
        await Reviewschema.create(req.body);
        res.status(201).send("Successfully created new review.");

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


router.get('/getsum_review/:IDproduct', (req, res) => {
    Reviewschema.aggregate([
        { $match: { IDproduct:mongoose.Types.ObjectId(req.params.IDproduct) } }, // กรองเอกสารที่มี IDproduct เท่ากับค่าที่ระบุ
        { $group: { _id: null, totalScore: { $sum: "$ratingscore" } } } // หาผลรวมของ ratingscore จากเอกสารที่เหลือ
    ]).then((result) => {
        if (result.length > 0) {
            res.json({ totalScore: result[0].totalScore }); // ส่งผลลัพธ์กลับเป็น JSON
        } else {
            res.json({ totalScore: 0 }); // ถ้าไม่มีข้อมูลที่ตรงกับเงื่อนไข
        }
    }).catch((err) => {
        res.status(500).json({ error: err.message }); // ส่งข้อความผิดพลาดกลับเป็น JSON
    });
});



router.get('/getcount_review/:IDproduct', (req, res) => {
    Reviewschema.find({ IDproduct: req.params.IDproduct }) // ใช้ findOne แทน findById
        .then((result) => {
            res.json(result); // ส่งผลลัพธ์กลับเป็น JSON
        }).catch((err) => {
            res.status(500).json({ error: err.message }); // ส่งข้อความผิดพลาดกลับเป็น JSON
        });
});


module.exports = router;