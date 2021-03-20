const app=require('../app');
const userController=require('../controllers/user.controller');
const {verifyAccessToken} =require('../middleware/authcheck.middleware');
module.exports=(app)=>{
  
    app.post('/signUp',userController.signUp);
    app.post('/login',userController.login);
    app.get('/getUsers',verifyAccessToken,userController.getUser);
    app.post('/refresh-token',userController.generateRefreshToken)
}