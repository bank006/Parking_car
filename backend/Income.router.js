const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();


router.use(cors());
router.use(express.json());

let incomeSchema = require('./models/income');

router.get('/', (req, res) => {
    incomeSchema.find((err, data) => {
        if (err) {
            return next(err)
        } else {
            console.log(data)
            res.status(200).send(data)
        }
    })
})

router.post('/postincome', (req, res) => {
    const { IDbookinghis, IDproductregishis, IDuserhis, storeregishis, timebookinghis, bookingtimehis, statuspayment, price } = req.body
    incomeSchema.create({ IDbookinghis, IDproductregishis, IDuserhis, storeregishis, timebookinghis, bookingtimehis, statuspayment, price })
        .then((resincome) => {
            res.send(resincome)
        }).catch((err) => {
            res.send(err)
        })
})

// router.get('/sumofincome/:IDstore')

router.get('/getincome/:years/:IDstore', (req, res) => {
    const selectedYear = req.params.years // รับปีที่ต้องการจาก query parameter
    const startOfYear = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
    incomeSchema.aggregate([
        {
            $addFields: {
                bookingDate: { $toDate: "$bookingtimehis" },
                month: { $month: { $toDate: "$bookingtimehis" } },
                year: { $year: { $toDate: "$bookingtimehis" } } // เพิ่ม year field
            }
        },
        {
            $match: {
                bookingDate: {
                    $gte: startOfYear,
                    $lt: endOfYear
                },
                storeregishis: mongoose.Types.ObjectId(req.params.IDstore)

            }
        },
        {
            $group: {
                _id: "$month",
                totalAmount: { $sum: { $toDouble: "$price" } }
            }
        }
    ])
        .then((resincome) => {
            res.send(resincome);
        }).catch((err) => {
            res.send(err);
        })
});

router.get('/getincomeperday/:years/:months/:days/:IDstore', (req, res) => {
    const selectedYear = parseInt(req.params.years); // รับปีที่ต้องการจาก query parameter
    const selectedMonth = parseInt(req.params.months); // รับเดือนที่ต้องการจาก query parameter
    const selectedDay = parseInt(req.params.days); // รับวันที่ต้องการจาก query parameter
    const dateMatch = {
        $match: {
            year: selectedYear
        }
    };

    if (selectedMonth) {
        dateMatch.$match.month = selectedMonth;
    }

    if (selectedDay) {
        dateMatch.$match.day = selectedDay;
    }

    incomeSchema.aggregate([
        {
            $addFields: {
                year: { $year: { $toDate: "$timebookinghis" } },
                month: { $month: { $toDate: "$timebookinghis" } },
                day: { $dayOfMonth: { $toDate: "$timebookinghis" } } // เพิ่ม day field
            }
        },
        {
            $match: {
                storeregishis: mongoose.Types.ObjectId(req.params.IDstore)
            }
        },
        dateMatch,
        {
            $group: {
                _id: { year: "$year", month: "$month", day: "$day" },
                totalAmount: { $sum: { $toDouble: "$price" } }
            }
        }
        

    ])
        .then((resincome) => {
            res.send(resincome);
        }).catch((err) => {
            res.send(err);
        })
});

router.get('/allincome/:IDstore',(req, res)=>{
    incomeSchema.aggregate([{$match:{storeregishis: mongoose.Types.ObjectId(req.params.IDstore)}},{
        $group: {
            _id:"$storeregishis",
            totalAmount: { $sum: { $toDouble: "$price" } }
        }
    }])
    .then((allincome)=>{
        res.send(allincome)
    }).catch((err)=>{
        res.send(err)
    })
})

module.exports = router; 