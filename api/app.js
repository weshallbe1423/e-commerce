const express=require('express');
const logger=require('morgan');
const app=express();
const cors=require('cors');
const bodyParser=require('body-parser');
const createError=require('http-errors');
require('./config/initMongodb');
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


require('./routes/user.route')(app);
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
