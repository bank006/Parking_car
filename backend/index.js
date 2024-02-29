let express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    path = require('path'),
    dbconfig = require('../backend/database/db')



const usersRouter = require('./Users.router');
const employeeRouter = require('../backend/routers/Employee.router');
const adminRouter = require('../backend/routers/Admin.router');
const profileRouter = require('./Profile.router')
const storeRouter = require('./store.router')
const productRouter = require('./Product.router')
const bookingRouter = require('./Booking.router')
const bookingconRouter = require('./Bookingcon.router')
const bookinghisRouter = require('./Bookinghis.router')
const shoppingcardRouter = require('./Shoppingcard.router')
const qrprompayRouter = require('./qr-prompay.router')
const otpRouter  = require('./Otp.router')
const income = require('./Income.router')
const storechat = require('./Storechat')


const session = require('express-session');

global.logInid = null

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect(dbconfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    // สร้างดัชนีที่นี่
    const yourCollection = mongoose.connection.collection('yourCollectionName');
    yourCollection.createIndexes({ yourField: 1 }, function (err, result) {
        if (err) {
            console.error(err);
        } else {
            console.log('Indexes created successfully', result);
        }
    });
    console.log("database connect");
}, (err) => {
    console.log(err);
})


const app = express();

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}))
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use((cors()));

app.get('*',(req , res ,next)=>{
    let logInid = req.session.userId
    next();
})

app.use('/users' , usersRouter);
app.use('/employee' , employeeRouter)
app.use('/admin' , adminRouter)
app.use('/profile' , profileRouter)
app.use('/store', storeRouter)
app.use('/product' , productRouter)
app.use('/booking', bookingRouter)
app.use('/bookingcon' , bookingconRouter )
app.use('/bookinghis' , bookinghisRouter )
app.use("/shoppingcart", shoppingcardRouter );
app.use("/payment" , qrprompayRouter)
app.use('/images', express.static(path.join(__dirname, './qrcode')));
app.use('/otp' , otpRouter)
app.use('/income' , income)
app.use('/storechat', storechat)
// app.use('/booking' , bookingRouter )


const port = process.env.PORT || 4001;
const server = app.listen(port,()=>{
    console.log('connecting port'+ port)
})


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
  });
  

 app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
  
    res.status(err.statusCode).json({
      message: err.message
    });
  });





