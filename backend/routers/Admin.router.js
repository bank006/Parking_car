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
    const {admin_name , admin_password , admin_passwordnh} = req.body
    
    Adminshema.create({admin_name , admin_password , admin_passwordnh} ,(err , admindata)=>{
        if(err){
            console.log(err)
        }
        else{
            res.status(200).send(admindata)
        }
    })
})

module.exports = router 