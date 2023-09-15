const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();


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

module.exports = router 