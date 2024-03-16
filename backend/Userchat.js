const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();


router.use(cors());
router.use(express.json());

let Userchat = require('./models/userchat');
const userchats = require('./models/userchat');

router.get('/', (req, res) => {
    Userchat.find((err, data) => {
        if (err) {
            return next('err',err)
        } else {
            console.log(data)
            res.status(200).send(data)
        }
    })
})

router.post('/userchatpost', (req, res) => {
    Userchat.create(req.body)
        .then((userchat) => {
            if (!userchat) {
                res.send('error create booking history')
            } else {
                res.send(userchat)
            }
        }).catch((err) => {
            res.send(err)
        })
})

router.get('/getuserchat/:IDuser' , (req ,res)=>{
    userchats.find({IDuser : req.params.IDuser}).then((userchat)=>{
        res.send(userchat)
    }).catch((err)=>{
        res.send(err)
    })
})


module.exports = router;