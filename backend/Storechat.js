const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors');
const router = express();

router.use(cors());
router.use(express.json());

let Storechatschema = require('../backend/models/storeuser_chat')

router.get('/', (req, res) => {
    Storechatschema.find((err, data) => {
        if (err) {
            return next(err)
        } else {
            console.log(data)
            res.status(200).send(data)
        }
    })
})

router.post('/storechatpost', (req, res) => {
    Storechatschema.create(req.body)
        .then((storechat) => {
            if (!storechat) {
                res.send('error create booking history')
            } else {
                res.send(storechat)
            }
        }).catch((err) => {
            res.send(err)
        })
})

router.get('/getstore' , (req ,res)=>{
    res.send('asd')
})


module.exports = router;