const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();
const argon2 = require('argon2');


router.use(cors());
router.use(express.json());


let Adminshema = require('../models/admin')

router.get('/', (req ,res , next)=>{
    Adminshema.find((err ,data)=>{
        if(err){
            return next (err)
        }
        else{
            res.status(200).send(data)
        }
    })
})

router.post('/postadmin' , (req ,res ,next)=>{
    const {admin_name , admin_email , admin_password , admin_passwordnh} = req.body
    Adminshema.findOne({admin_email:admin_email}).then((adminsob)=>{
        if(!adminsob){
            Adminshema.create({admin_name ,admin_email, admin_password , admin_passwordnh} ,(err , admindata)=>{
                console.log(admindata)
                res.status(200).json(adminsob)
                if(err){
                    console.log(err)
                }
            })
        }else{
            const ms =  "email have in system"
            res.json({ms});
            console.log(ms)
        }
    })
})


router.get ('/email_admin' , (req ,res , next )=>{
    Adminshema.aggregate([{$project:{adminmail:'$admin_email' , password : '$admin_passwordnh'}}],(err ,admindata)=>{
        if(err){
            return next(err)
        }else{
            console.log(admindata)
            res.status(200).send(admindata)
        }
    })
})

router.get('/dataAdmin/:useremail' , async(req , res , next)=>{
    const adminemail = req.params.useremail
    let getdataAdmin = await Adminshema.findOne({admin_email : req.params.useremail})
    res.status(200).json(getdataAdmin)
})


// router.post('/loginsadmin', (req, res) => {
//     const { email, password } = req.body; // เปลี่ยน emails เป็น email
//     // res.json(req.body)
//     Adminshema.findOne({ admin_email: email }).then((user) => {
//         if (user) {
//             try {
//                 // เปรียบเทียบรหัสผ่าน
//                 const isPasswordValid = argon2.verify(user.admin_password, password); // เปลี่ยน passwords เป็น password

//                 if (isPasswordValid) {
//                     res.send(user)
//                     console.log('รหัสผ่านถูกต้อง');
//                 } else {
//                     console.log('รหัสผ่านไม่ถูกต้อง');
//                 }
//             } catch (error) {
//                 console.error('เกิดข้อผิดพลาดในการเปรียบเทียบรหัสผ่าน:', error);
//             }
//         } else {
//             console.log('ไม่พบผู้ใช้');
//         }
//     });
// });


router.post('/loginsadmin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Adminshema.findOne({ admin_email: email });
        if (!user) {
            return res.status(200).json({ success: false, message: 'ไม่พบผู้ใช้' });
        }

        const isPasswordValid = await argon2.verify(user.admin_password, password);
        if (!isPasswordValid) {
            return res.status(200).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
        }

        // ทำสิ่งที่คุณต้องการเมื่อรหัสผ่านถูกต้อง เช่นการสร้างโทเคน, เข้าสู่ระบบ, และอื่น ๆ
        res.json({ success: true  , data: user });

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', error);
        res.status(200).json({ success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
    }
});

module.exports = router 