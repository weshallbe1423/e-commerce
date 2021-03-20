//function for logic
const User=require('../models/user.model');
const createError=require('http-errors');
const bcrypt=require('bcrypt');
const {signAccessToken,signRefreshToken} =require('../middleware/authcheck.middleware');
const {authSchema} =require('../helper/validate.schema');
//signup user
exports.signUp=async (req,res,next)=>{
    try{
        const resultSchema=await authSchema.validateAsync(req.body);
        console.log(resultSchema);

        const doesUserExists=await User.findOne({email:resultSchema.email});
        if(doesUserExists){ 
            throw createError.Conflict(`${resultSchema.email} is already been registered`);
         }else{
             const user=new User(resultSchema);
             const resp= await user.save();
             const token = await signAccessToken(resp.id)
             const refreshToken=await signRefreshToken(resp.id);
            res.send({
                message:"user created successfully",
                userDetails:resp,
                accessToken:token,
                refreshToken:refreshToken
            })
         }
    }
    catch(err){
        if(err.isJoi ===true)
         return next(createError.BadRequest('Invalid email/password')); 
        next(err);
    }
}
//login user
exports.login=async(req,res,next)=>{
    try{
        console.log(req.body)
        const result=await authSchema.validateAsync(req.body);
        const user= await User.findOne({email:result.email});
        if(!user) throw createError.NotFound('User not found');
        const isMatch=await user.isValidPassword(result.password);
        if(!isMatch) throw createError.Unauthorized('Username/Password not valid');
        let accessToken=await signAccessToken(user.id);
        let refreshToken=await signRefreshToken(user.id);
        res.send({accessToken,refreshToken});
    }catch(err){
        if(err.isJoi===true) err.status=422;
        next(err)
    }
   
}
exports.getUser=(req,res,next)=>{
    try {
        console.log(req.headers['authorization'])
        res.send('Token');
    } catch (error) {
        next(error);
    }
}

exports.generateRefreshToken=async(req,res,next)=>{
    try {
        const{refreshToken}=req.body;
        if(!refreshToken) throw createError.Unauthorized();
        const userId=await signRefreshToken(refreshToken);
        const accessToken=await signAccessToken(userId);
        const refToken=await signRefreshToken(userId);
        res.send({accessToken:accessToken,refreshToken:refToken});        
    } catch (error) {
        next(error);
    }

}