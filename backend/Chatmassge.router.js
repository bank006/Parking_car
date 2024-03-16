const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();


router.use(cors());
router.use(express.json());

let Chatmessages = require('./models/Chatmessage')

router.get('/', (req, res) => {
    Chatmessages.find((err, data) => {
        if (err) {
            return next(err)
        } else {
            console.log(data)
            res.status(200).send(data)
        }
    })
})

router.post('/postmessage', (req, res) => {
    const {IDstorechat, IDuserchat ,message , status } = req.body
    Chatmessages.create({IDstorechat, IDuserchat ,message , status })
        .then((resincome) => {
            res.send(resincome)
        }).catch((err) => {
            res.send(err)
        })
})

router.get('/getmessage/:IDstorechat/:IDuserchat',(req , res)=>{
    const IDstorechat =  req.params.IDstorechat
    const IDuserchat =  req.params.IDuserchat
    Chatmessages.aggregate([
        {
            $match: {
                IDstorechat: mongoose.Types.ObjectId(IDstorechat),
                IDuserchat: mongoose.Types.ObjectId(IDuserchat)
            }
        }
    ])
    .then((messageresult) => {
        res.send(messageresult);
    })
    .catch((err) => {
        res.send(err);
    });
})


router.get('/countMessages/:IDstorechat/:IDuserchat', (req, res) => {
    const IDstorechat = req.params.IDstorechat;
    const IDuserchat = req.params.IDuserchat;
    
    Chatmessages.aggregate([
        {
            $match: {
                IDstorechat: mongoose.Types.ObjectId(IDstorechat),
                IDuserchat: mongoose.Types.ObjectId(IDuserchat)
            }
        },
        {
            $count: "totalMessages"
        }
    ])
    .then((result) => {
        if (result.length > 0) {
            res.json({ count: result[0].totalMessages });
        } else {
            res.json({ count: 0 }); // ถ้าไม่มีข้อมูลที่ตรงกับเงื่อนไข
        }
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    });
});


router.get('/getstatueMessages/:IDstorechat/:IDuserchat', (req, res) => {
    const IDstorechat = req.params.IDstorechat;
    const IDuserchat = req.params.IDuserchat;
    
    Chatmessages.aggregate([
        {
            $match: {
                IDstorechat: mongoose.Types.ObjectId(IDstorechat),
                IDuserchat: mongoose.Types.ObjectId(IDuserchat),
                status :'0'
            }
        }
    ])
    .then((result) => {
        if (result.length > 0) {
            res.json(result);
        } else {
            res.json({ count: 0 }); // ถ้าไม่มีข้อมูลที่ตรงกับเงื่อนไข
        }
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

router.get('/getstatueMessagesuser/:IDstorechat/:IDuserchat', (req, res) => {
    const IDstorechat = req.params.IDstorechat;
    const IDuserchat = req.params.IDuserchat;
    
    Chatmessages.aggregate([
        {
            $match: {
                IDstorechat: mongoose.Types.ObjectId(IDstorechat),
                IDuserchat: mongoose.Types.ObjectId(IDuserchat),
                status :'1'
            }
        }
    ])
    .then((result) => {
        if (result.length > 0) {
            res.json(result);
        } else {
            res.json({ count: 0 }); // ถ้าไม่มีข้อมูลที่ตรงกับเงื่อนไข
        }
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    });
});


router.delete('/deletemessage/:IDchat' , (req , res)=>{
    const IDchat = req.params.IDchat;
    Chatmessages.findByIdAndDelete({_id : IDchat})
    .then((delresult)=>{
        res.send(delresult)
    }).catch((err)=>{
        res.send(err)
    })
})

router.put('/updatemessage/:IDchat' ,(req , res)=>{
    const IDchat = req.params.IDchat;
    const Mesaageupdate = req.body.Mesaageupdate;
    Chatmessages.findByIdAndUpdate(IDchat ,{message : Mesaageupdate } , { new: true })
    .then((updateresult)=>{
        res.send(updateresult)
    }).catch((err)=>{
        res.send(err)
    })
})


module.exports = router;