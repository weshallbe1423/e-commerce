const JWT=require('jsonwebtoken');
const createError=require('http-errors');
const client=require('../config/initRedis');
module.exports={
    signAccessToken:(userId)=>{
        return new Promise((resolve,reject)=>{
            const payload={};
            const secret=process.env.ACCESS_TOKEN_SECRET;
            const options={
                expiresIn:"30s",
                issuer:"vishalnik",
                audience:userId
            };
            JWT.sign(payload,secret,options,(err,token)=>{
                if(err){
                    return reject(createError.InternalServerError());
                }else{
                    console.log(token);
                    resolve(token);
                }
            })
        })
    },
    verifyAccessToken:(req,res,next)=>{
        if(!req.headers['authorization']) return next(createError.Unauthorized());
        const token=req.headers['authorization'].split(' ') [1];
        JWT.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payload)=>{
            if(err){
                // if(err.name==='JsonWebTokenError'){
                //     return next(createError.Unauthorized());
                // }else{
                //     return next(createError.Unauthorized(err.message));
                // }
            const message=err.message ==='JsonWebTokenError' ? 'Unauthorized':err.message;
            next(message);

            }
            req.payload=payload;
            next();
        })

    },
    signRefreshToken:(userId)=>{
        return new Promise((resolve,reject)=>{
            const payload={};
            const secret=process.env.ACCESS_TOKEN_SECRET;
            const options={
                expiresIn:"1d",
                issuer:"vishalnik",
                audience:userId
            };
            JWT.sign(payload,secret,options,(err,token)=>{
                if(err){
                    return reject(createError.InternalServerError());
                }
                client.set(userId,token,'EX',365*24*60*60,(err,reply)=>{
                        if(err){
                            console.log(err.message);
                            reject(createError.InternalServerError());
                            return
                        }
                        resolve(token);
                    })
            })
        })
    },
    verifyRefreshToken:(refreshToken)=>{
       return new Promise((resolve,reject)=>{
        JWT.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,payload)=>{
            if(err) return reject(createError.Unauthorized());
            const userId=payload.aud;
            client.GET(userId,(err,result)=>{
                if(err){
                    console.log(err.message);
                    reject(createError.InternalServerError());
                }
                if(refreshToken===result) return resolve(userId)
                reject(createError.Unauthorized());
            })
        })

       })
    },
  
}