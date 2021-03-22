const express=require('express');
const logger=require('morgan');
const app=express();
const cors=require('cors');
const bodyParser=require('body-parser');
const createError=require('http-errors');
const readFileSync=require('fs');
require('./config/initMongodb');
require('./config/initRedis');
app.use(logger('dev'));
app.use(cors());
const path=require('path');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// const staticPath=path.join(__dirname,'./public');
app.use(express.static(path.join(__dirname,'./public/ecommerce/')));
require('./routes/user.route')(app);
// api\public\ecommerce

app.get('/', (req,res) => {
    res.sendFile(express.static(path.join(__dirname,'./public/ecommerce/index.html')))
  });
  
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
//error handling 404
app.use((req,res,next)=>{
    next(createError.NotFound());
})
app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.send({
        error:{
            status:err.status || 500,
            message:err.message
        }
    })
})

module.exports=app;
