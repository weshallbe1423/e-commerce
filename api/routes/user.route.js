const app=require('../app');
const userController=require('../controllers/user.controller');
module.exports=(app)=>{
  
    app.post('/signUp',userController.signUp);
    app.post('/login',userController.login);

}