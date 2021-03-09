const JWT=require('jsonwebtoken');
const createError=require('http-errors');
module.exports={
    signAccessToken:(userId)=>{
        return new Promise((resolve,reject)=>{
            const payload={};
            const secret=process.env.ACCESS_TOKEN_SECRET;
            const options={
                expiresIn:"1h",
                issuer:"vishalnik",
                audience:userId
            };
            JWT.sign(payload,secret,options,(err,token)=>{
                if(err){
                    return reject(createError.InternalServerError());
                }else{
                    resolve(token);
                }

            })

        })
    }

}