const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();


router.use(cors());
router.use(express.json());

let EmployeeShema = require('../models/employee')


router.get('/', (req , res , next)=>{
    EmployeeShema.find((err ,data)=>{
        if(err){
            return next (err)
        }
        else{
            res.status(200).send(data)
        }
    })
})

// router.post('/postemployee', (req , res ,next)=>{
//     const {firstname , lastname , email , password} = req.body
//     EmployeeShema.create(())
    
    
// })

module.exports = router ;