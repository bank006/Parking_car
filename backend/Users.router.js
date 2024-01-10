const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();
const multer = require('multer')
const path = require('path')
const argon2 = require('argon2');


router.use(cors());
router.use(express.json());


let UserShema = require('./models/users');
let ProfileShema = require('./models/profile')
const users = require('./models/users');
const { Link } = require('react-router-dom');
const { result } = require('lodash');

// หน้าหลักการใช้เรียก  APIs เรียกเป็น http users
router.get('/', (req, res) => {
    UserShema.find((err, data) => {
        if (err) {
            return next(err)
        } else {
            console.log(data)
            res.status(200).send(data)
        }
    })
})

router.get('/getemail', (req, res, next) => {
    UserShema.aggregate([{ $project: { email: '$email' } }], (err, datass) => {
        if (err) {
            return next(err)
        } else {
            console.log(datass)
            res.status(200).send(datass)
        }
    })
})

router.post('/register', (req, res, next) => {
    const { name, email, password, passwordnh, statusverify } = req.body;
    UserShema.findOne({ email: email }).then((usersob) => {
        if (!usersob) {
            UserShema.create({ name, email, password, passwordnh, statusverify }, (err, datasob) => {
                console.log(datasob);
                res.status(200).json(datasob)
                if (err) {
                    console.log(err)
                }
            })
        } else {
            const message = "มีเมลนี้มีในระบบแล้วนะนุ้ย";
            res.json({ message });
            console.log(message)
        }
    })
})


router.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserShema.findOne({ email: email }).then((user) => {
        console.log(user)
        if (!user) {
            console.log('donhavepassword');
            res.json('donhavepassword');
        } else {
            const vrfpassword = argon2.verify(user.password, password).then((verifypass) => {
                if (verifypass == true) {
                    console.log(verifypass)
                }
                else {
                    console.log('error')
                }
            })

        }
    });
});



router.post('/logins', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserShema.findOne({ email: email });
        if (!user) {
            return res.status(200).json({ success: false , message: 'ไม่พบผู้ใช้' });
        }

        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            return res.status(200).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
        }

        // ทำสิ่งที่คุณต้องการเมื่อรหัสผ่านถูกต้อง เช่นการสร้างโทเคน, เข้าสู่ระบบ, และอื่น ๆ
        res.json({ success: true, data: user });

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', error);
        res.status(200).json({ success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
    }
});


router.get('/getUsers', (req, res, next) => {
    UserShema.aggregate([{ $project: { username: '$name', useremail: '$email', passNhash: '$passwordnh' } }], (err, userpw) => {
        if (err) {
            return next(err)
        } else {
            console.log(userpw)
            res.status(200).send(userpw)
        }
    })
})


router.get('/dataUsers/:usersemail', async (req, res, next) => {
    const usersemail = req.params.usersemail
    let getdataUser = await UserShema.findOne({ email: req.params.usersemail })
    res.status(200).json(getdataUser)
})

router.get('/datadetail/:IDuser', async (req, res, next) => {
    const IDuser = req.params.IDuser
    let getIDuser = await UserShema.findOne({ _id: req.params.IDuser })
    res.status(200).json(getIDuser)
})

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../public/image/')
    },
    filename: (req, file, cb) => {
        // const uniqueSuffix = Date.now
        cb(null, file.originalname)
    },

});

const upload = multer({ storage: Storage })

router.put('/userProfile_post', upload.single('image'), async (req, res, next) => {
    console.log(req.body)
    const imageName = req.file.filename;
    const IDuser = req.body.IDuser

    try {
        await UserShema.findByIdAndUpdate(IDuser, { image: imageName }, { new: true });
        res.json({ status: ok })
    } catch (error) {
        res.json({ status: error })
    }
})

router.get("/getimage/:UserId", (req, res) => {
    const UserId = req.params.UserId
    try {
        UserShema.findOne({ _id: UserId }).then((data) => {
            res.send(data);
        });
    } catch (error) {
        res.json({ status: error });
    }
})



router.put('/update_verify', (req, res) => {
    UserShema.updateOne({email : req.body.email} , {$set :{statusverify : true}})
    .then((resverify)=>{
        if(!resverify){
            return res.status(401).send("Error")
        }else{
            res.send(resverify)
        }
    }).catch((err)=>{
        res.status(500).send(err)
    })

})

router.put('/updatedata' , (req , res)=>{
    UserShema.updateOne({_id : req.body.id},{$set :{name:req.body.validatename , email : req.body.validateemail}})
    .then((res)=>{
        res.status(200).send(res)
    }).catch((err)=>{
        res.send(err)
    })

})

router.put('/changprofile' ,(req , res)=>{
    const {IDuser , numberValue} = req.body
    console.log(IDuser ,numberValue)
    UserShema.findByIdAndUpdate({_id : IDuser }, {$set:{selectorsimg : numberValue}})
    .then((result)=>{
        res.send(result)
    }).catch((err)=>{
        res.send(err)
    })
} )

router.put('/resetprofile' , (req , res)=>{
    const {IDuser} = req.body
    UserShema.findByIdAndUpdate({_id:IDuser},{$set:{selectorsimg: -1}})
    .then((reset)=>{
        res.send(reset)
    }).catch((err)=>{
        res.send(err)
    })
})




module.exports = router;



