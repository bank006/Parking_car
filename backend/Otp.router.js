const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();
const nodemailer = require('nodemailer');


router.use(cors());
router.use(express.json());

let OTPschema = require('./models/otp')

router.get('/', (req, res) => {
    OTPschema.find((err, data) => {
        if (err) {
            return next(err)
        } else {
            console.log(data)
            res.status(200).send(data)
        }
    })
})




const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

// สร้าง transporter สำหรับส่งอีเมล
const transporter = nodemailer.createTransport({
    service: 'Gmail', // เลือกบริการอีเมลที่คุณใช้
    auth: {
        user: 'Withun.ksr@gmail.com', // อีเมลของคุณ
        pass: 'cvyg gtci xksh asqb' // รหัสผ่านของคุณ
    }
});



router.post('/sendOTP', (req, res) => {
    const email = req.body.email;
    const newOTP = generateOTP();

    const otpData = {
        email: email,
        otp: newOTP
    };
    const newotpData = new OTPschema(otpData)

    newotpData.save((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving OTP to the database');
        } else {
            // สร้างคอนฟิกสำหรับอีเมล
            const mailOptions = {
                from: 'Parkme',
                to: 'naybang2557@gmail.com', // อีเมลของผู้รับ
                subject: 'Verification Code',
                text: `Your OTP code is ${newOTP}` // เนื้อหาของอีเมล
            };

            // ส่งอีเมล
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending email: ' + error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    });
})


router.post('/verify-otp', (req, res) => {
    const { email, userOTP } = req.body;
    OTPschema.findOne({ email, otp: userOTP }, (err, otp) => {
        if (err || !otp) {
            res.send('Invalid OTP');
        } else {
            otp.remove((err) => {
                if (err) {
                    console.error(err);
                }
                res.json({success : true , data:'OTP verified successfully'});
            });
        }
    });
});


module.exports = router;