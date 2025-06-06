import { changePassword, getresetToken,passportAuth,userController, verifyPasswordToken } from './../controllers/authController';
import { Router } from "express";
import { loginController,registerController } from "../controllers/authController";
import {authMiddleWare}  from "../middlewares/authMiddleware";
import passport, { strategies } from 'passport';
import { string } from 'zod';

const authRoute = Router()

authRoute.post('/login',loginController)
authRoute.post('/register',registerController)
authRoute.post('/user', authMiddleWare, userController)
authRoute.post('/get-token', getresetToken)
authRoute.post('/verify-email',verifyPasswordToken)
authRoute.post('/reset-password',changePassword)


authRoute.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

authRoute.get('/google/redirect', passport.authenticate('google'),passportAuth);


 

export default authRoute