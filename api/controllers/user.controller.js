//function for logic
const User=require('../models/user.model');
const createError=require('http-errors');
const bcrypt=require('bcrypt');

//signup user
exports.signUp=async (req,res,next)=>{
    try{
        const {email,password,userType}=req.body;
        // let users=new User();
        if(!email || !password) throw createError.BadRequest("");
        const doesUserExists=await User.findOne({email:email});
        if(doesUserExists){ 
            throw createError.Conflict(`${email} is already been registered`);
         }else{
             let salt=await bcrypt.genSalt(10);
             let hashPassword=await bcrypt.hash(password,salt);
             const user=new User({
                 email:email,
                 password:hashPassword,
                 userType:userType
             })
            const resp= await user.save();
            res.send({
                message:"user created successfully",
                userDetails:resp
            })
         }
    }
    catch(err){
        next(err);
    }
}
//login user
exports.login=async(req,res,next)=>{
    try{
        const {email,password} =req.body
        const user= await User.findOne({email:email});
        if(user){
            const validatePassword=bcrypt.compare(password,user.password);
            if(validatePassword){
                res.send({
                    message:"Login success"
                })
            }else{
                throw createError.Unauthorized('Password incorrect')
            }
        }
    }catch(err){
        next(err)
    }
   
}