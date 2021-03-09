const Joi=require('joi');

const authSchema=Joi.object({
    email:Joi.string().email().lowercase().required(),
    password:Joi.string().min(8).required(),
    userType:Joi.optional()
})

module.exports={
    authSchema
}