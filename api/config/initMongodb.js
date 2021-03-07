const mongoose=require('mongoose');
require('dotenv').config();
//init mongodb
mongoose.connect(process.env.MONGO_URL,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log('Mongodb Connected');
})
.catch(err=>{
    console.log(`connection err ${err.message}`);
})

mongoose.connection.on('connected',()=>{
    console.log("mongoose connected to mongodb");
});
mongoose.connection.on('disconnected',()=>{
    console.log("mongoose disconnected from mongodb");
});
mongoose.connection.on('error',(err)=>{
    console.log(err.message)
});
process.on('SIGINT',async()=>{
    await mongoose.connection.close();
    process.exit(0);
})