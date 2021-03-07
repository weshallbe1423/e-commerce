//user model
const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    userType:{
        type:String,
        enum:['admin','user','supervisor'],
        default:'user'
    },
})


const User=module.exports=mongoose.model('Users',UserSchema);