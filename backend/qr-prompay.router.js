const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();
const qrcode = require('qrcode');
const _ = require('lodash')
const path = require('path');
const moment = require('moment');
const generatePayload = require('promptpay-qr');
const uuid = require('uuid'); // Import แพ็กเกจ uuid

router.use(cors());
router.use(express.json());

let PromptPayPayment = require('./models/qr-prompay')


router.post('/generateQRRatetime', (req, res) => {
    const amount = parseFloat(_.get(req, ["body", "integerMinutes"]));
    const id = req.body.id
    const mobileNumber = '0653724853'

    const randomReferenceCode = _.random(100000, 999999);

    const fileName = randomReferenceCode + '.jpg'
    const destinationFolder = './qrcode'
    const fileFullPath = path.join(destinationFolder, fileName);


    // สร้าง payload
    const payload = generatePayload(
        mobileNumber, { amount, randomReferenceCode }
    )

    // ตั้งค่าตัวเลือกสำหรับ QR Code
    const options = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        quality: 0.92,
        margin: 1,
        scale: 4,
        color: {
            dark: '#000',
            light: '#fff'
        }
    };


    // สร้าง QR Code และบันทึกลงไฟล์
    qrcode.toFile(fileFullPath, payload, options, async function (err) {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการสร้าง QR Code:', err);
            return res.status(400).json({
                RespCode: 400,
                RespMessage: 'เกิดข้อผิดพลาดในการสร้าง QR Code'
            });
        } else {
            const fouudpayment = await PromptPayPayment.findOne({ IDbooking: id })
            if (!fouudpayment) {
                return res.status(404).send({ message: "Not found" });
            } else {
                try {
                    await PromptPayPayment.updateOne(
                        { IDbooking: id },
                        {
                            $set: {
                                imageQRratetime: fileName,
                                amountratetime: amount // ตัวอย่างการอัพเดตค่าอื่น ๆ
                            }
                        }
                    );
                    console.log('ข้อมูลการจ่ายเงินถูกบันทึกลงในฐานข้อมูล');
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'QR Code ถูกสร้างและบันทึก',
                        Result: id + 'jpg'
                    });
                } catch (error) {
                    console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
                    return res.status(500).json({
                        RespCode: 500,
                        RespMessage: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
                    });
                }
            }
        }
    });
})

router.post('/generateQR', (req, res) => {
    const amount = parseFloat(_.get(req, ["body", "integerMinutes"]));
    const id = req.body.id
    const mobileNumber = '0653724853';


    // สร้างรหัสอ้างอิง UUID
    const referenceCode = uuid.v4(); // สร้าง UUID แบบสุ่ม
    const randomReferenceCode = _.random(100000, 999999);

    // const fileName = 'custom-filename.jpg';
    const fileName = randomReferenceCode + '.jpg';
    const destinationFolder = './qrcode'
    const fileFullPath = path.join(destinationFolder, fileName);

    // สร้าง payload
    const payload = generatePayload(
        mobileNumber, { amount, randomReferenceCode }
    );

    // ตั้งค่าตัวเลือกสำหรับ QR Code
    const options = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        quality: 0.92,
        margin: 1,
        scale: 4,
        color: {
            dark: '#000',
            light: '#fff'
        }
    };

    // สร้าง QR Code และบันทึกลงไฟล์
    qrcode.toFile(fileFullPath, payload, options, async function (err) {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการสร้าง QR Code:', err);
            return res.status(400).json({
                RespCode: 400,
                RespMessage: 'เกิดข้อผิดพลาดในการสร้าง QR Code'
            });
        } else {
            // console.log(data)
            console.log('PromptPay QR Code ถูกสร้างและบันทึกใน ', fileName);

            // สร้างข้อมูล Payment สำหรับบันทึก
            const paymentData = {
                recipientType: 'mobile',
                recipientValue: mobileNumber,
                amount: amount,
                currency: 'THB',
                imageQR: fileName,
                IDbooking: id,
                reference: randomReferenceCode,
                paymentDate: new Date()
            };

            // บันทึกข้อมูลลงในฐานข้อมูล
            const newPayment = new PromptPayPayment(paymentData);

            try {
                await newPayment.save();
                console.log('ข้อมูลการจ่ายเงินถูกบันทึกลงในฐานข้อมูล');
                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'QR Code ถูกสร้างและบันทึก',
                    Result: id + 'jpg'
                });
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
                return res.status(500).json({
                    RespCode: 500,
                    RespMessage: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
                });
            }
        }
    });
});

router.get('/', (req, res) => {
    PromptPayPayment.find((err, data) => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการค้นหาข้อมูล:', err);
            return res.status(500).json({
                RespCode: 500,
                RespMessage: 'เกิดข้อผิดพลาดในการค้นหาข้อมูล'
            });
        } else {
            if (!data) {
                console.log('ไม่พบข้อมูล');
                return res.status(404).json({
                    RespCode: 404,
                    RespMessage: 'ไม่พบข้อมูล'
                });
            }

            console.log(data);
            return res.status(200).send(data);
        }
    });
});

router.get('/getpayment/:_id', (req, res) => {
    console.log(req.params._id)
    PromptPayPayment.find({ IDbooking: req.params._id })
        .then((respayment) => {
            res.send(respayment)
        }).catch((err) => {
            res.send(err)
        })
})



// สร้าง API endpoint เพื่อรับรูปภาพ
router.get('/api/images/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = express.static(path.join(__dirname, './qrcode', filename)); // รูปภาพอยู่ในโฟลเดอร์ qrcode

    // ส่งรูปภาพกลับไปยังเว็บเบราวเซอร์
    res.sendFile(imagePath);
});





module.exports = router;