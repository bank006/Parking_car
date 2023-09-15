const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs')
const router = express();


router.use(cors());
router.use(express.json());
router.use('/images', express.static(path.join(__dirname, './public')));


let ProfileShema = require('./models/profile')
let UserShema = require('./models/users')

router.get('/',(req , res , next)=>{
    ProfileShema.find((err , data )=>{
        if(err){
            return next (err)
        }
        else{
            res.status(200).send(data)
        }
    })
})


// const Storage = multer.diskStorage({
//     destination: './public',
//     filename:(req,file,cb)=>{
//         cb(null , file.originalname)
//     },

// });

const Storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null , '../public/images/')
    },
    filename:(req,file,cb)=>{
        // const uniqueSuffix = Date.now
        cb(null ,file.originalname)
    },

});

const upload = multer({storage : Storage})

router.post('/Profile_post',upload.single('image') , async(req , res ,next)=>{
 console.log(req.body)
 const imageName = req.file.filename;
 const IDuser = req.body.IDuser
 
 try{
    await ProfileShema.create({image : imageName , IDuser: IDuser})
    res.json({status : ok})
 }catch(error){
    res.json({status : error})
 }
} )


router.get("/getimage/:UserId", (req, res) => {
    const ObjectId = mongoose.Types.ObjectId;
    const UserId = req.params.UserId
    const objectIdUserId = new ObjectId(UserId);

    const User = require('./models/users'); 
    try {
      ProfileShema.aggregate([{$match:{IDuser : objectIdUserId}},{$lookup:{from: 'users' , localField: "IDuser" , foreignField :"_id" , as:"users"}}]).then((data) => {
        res.send({ status: "ok", data: data });
      });
    } catch (error) {
      res.json({ status: error });
    }
  });


  router.get('/joinprofile', (req ,res) => {
    const User = require('./models/users'); 
    ProfileShema.aggregate([{$lookup :{from: User.collection.name , localField: "IDuser" , foreignField :"_id" , as:"users"}}]).then((dataUser)=>{
        if(dataUser){
            res.send(dataUser)
        }
        else{
            res.send("no user")
        }
    }).catch((error)=>{
        res.send(error)
    })
  })












// router.route("/Profile_post").post((req,res)=>{
//     ProfileShema.create(req.body)
//     .then(product => res.json(product))
//     .catch(err => res.json(err))
//     })


module.exports = router 