const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();
const bcrypt = require('bcrypt')
const argon2 = require('argon2');

router.use(cors());
router.use(express.json());




let UserShema = require('../models/users');
const users = require('../models/users');
const { Link } = require('react-router-dom');

// หน้าหลักการใช้เรียก  APIs เรียกเป็น http users
router.get('/', (req,res)=>{
    UserShema.find((err,data)=>{
        if(err){
            return next(err)
        }else{
            console.log(data)
            res.status(200).send(data)
        }
    })
})

router.get('/getemail',(req,res,next)=>{
    UserShema.aggregate([{$project:{email:'$email'}}],(err,datass)=>{
        if(err){
            return next(err)
        }else{
            console.log(datass)
            res.status(200).send(datass)
        }
    })
})

router.post('/register',(req , res , next)=>{
    const {name , email , password , passwordnh} = req.body ;
    UserShema.findOne({email:email}).then((usersob)=>{
        if(!usersob){
            UserShema.create({name , email ,password  , passwordnh} , (err ,datasob)=>{
                console.log(datasob);
                res.status(200).json(datasob)
                if(err){
                    console.log(err)
                }
            })
        }else{
            const message = "มีเมลนี้มีในระบบแล้วนะนุ้ย";
            res.json({message});
            console.log(message)
        }
    })
})


router.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserShema.findOne({ email: email}).then((user) => {
        console.log(user)
      if (!user) {
        console.log('donhavepassword');
        res.json('donhavepassword');
      } else {
        const vrfpassword = argon2.verify(user.password ,password).then((verifypass)=>{
            if(verifypass == true){
                console.log(user)
                res.writeHead(302,{
                    'Location': '/Register'
                })
                
            }
            else{
                console.log('error')
            }
        })
        
      }
    });
  });
  

router.get('/getUsers',(req ,res ,next)=>{
    UserShema.aggregate([{$project:{username: '$name' ,useremail:'$email', passNhash:'$passwordnh'}}],(err, userpw)=>{
        if(err){
            return next(err)
        }else{
            console.log(userpw)
            res.status(200).send(userpw)
        }
    })
})


router.get('/dataUsers/:usersemail',async(req , res ,next)=>{
    const usersemail = req.params.usersemail
    let getdataUser = await UserShema.findOne({email: req.params.usersemail} )
    res.status(200).json(getdataUser)
})

router.get('/datadetail/:IDuser' ,async(req ,res, next)=>{
    const IDuser = req.params.IDuser
    let getIDuser = await UserShema.findOne({_id: req.params.IDuser})
    res.status(200).json(getIDuser)
})

module.exports =  router ;


