import express from 'express'
import { forgetPassword, refreshToken, resetPassword, signIn, signUp, verifyEmail } from './user.controller.js';
const router = express.Router();


router.post('/signup' , signUp)
router.get('/verifyEmail/:token' , verifyEmail)
router.get('/refreshToken/:rftoken' , refreshToken)
router.patch('/sendCode' , forgetPassword)
router.patch('/resetPassword' , resetPassword)
router.post('/signIn' , signIn)

export default router