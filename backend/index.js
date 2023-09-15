let express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    dbconfig = require('../backend/database/db')



const usersRouter = require('./Users.router');
const employeeRouter = require('../backend/routers/Employee.router');
const adminRouter = require('../backend/routers/Admin.router');
const profileRouter = require('./Profile.router')
const storeRouter = require('./store.router')
const productRouter = require('./Product.router')

const session = require('express-session');

global.logInid = null

mongoose.Promise = global.Promise;
mongoose.connect(dbconfig.db,{
    useNewUrlParser: true ,
}).then(()=>{
    console.log("database connect");
},
(err)=>{
    console.log(err);
}
)

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






const port = process.env.PORT || 4001;
const server = app.listen(port,()=>{
    console.log('connecting port'+ port)
})


app.use((req,res,next)=>{
     next((createError(404)))
 })

 app.use(function(err,res,req,next){
     console.error(err.message);
     if(!err.statusCode)err.statusCode = 500;

     res.status(err.statusCode).json({
         message:err.message
     })
    
 })





