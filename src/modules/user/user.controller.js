import userModel from "../../../db/user.model.js";
import { sendEmail } from "../../services/sendEmail.js";
import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import jwt from 'jsonwebtoken'
import  bcrypt  from 'bcryptjs'
import { customAlphabet } from "nanoid";


//===================================sign up=========================//

export const signUp = asyncHandler(async (req, res, next) => {
    const { name, email, password, cpassword, age, phone, address } = req.body
    const userExist = await userModel.findOne({ email: email.toLowerCase() })
    userExist && next(new AppError('user already exist', 409))
    const token = jwt.sign({ email }, 'generateTokenSecret', { expiresIn: 2 })
    const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`
    const rftoken = jwt.sign({ email }, 'generateTokenSecretRefresh')
    const rflink = `${req.protocol}://${req.headers.host}/users/refreshToken/${rftoken}`
    await sendEmail(email, 'verify your email', `<a href="${link}">click here</a><br><a href="${rflink}">click here to resend the link</a>`)
    const hash = bcrypt.hashSync(password, 10)
    const user = new userModel({ name, email, password: hash, age, phone, address })
    const newUser = await user.save()
    newUser ? res.status(201).json({ msg: 'done', user: newUser }) : next(new AppError('user not created', 500))
})



//============================verify email=====================================//
export const verifyEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, 'generateTokenSecret')
    if (!decoded?.email) return next(new AppError('invalid token', 400))
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: false }, { confirmed: true })
    user ? res.status(200).json({ msg: 'done' }) : next(new AppError('user not exist or already confirmed', 400))
})
//==============================refresh token=================//
export const refreshToken = asyncHandler(async (req, res, next) => {
    const { rftoken } = req.params
    let decoded;

    try {
        decoded = jwt.verify(rftoken, 'generateTokenSecretRefresh');
    } catch (error) {
        return next(new AppError('invalid token', 400));
    }

    if (!decoded?.email) return next(new AppError('invalid token', 400));

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
        return next(new AppError('user not exist', 400));
    }

    if (user.confirmed) {
        return next(new AppError('user already confirmed', 400));
    }

    const token = jwt.sign({ email: decoded.email }, 'generateTokenSecret', { expiresIn: '2m' });
    const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`;
    
    await sendEmail(decoded.email, 'verify your email', `<a href="${link}">click here</a>`);

    res.status(200).json({ msg: 'done' });
});

//=============================forget password=====================//
export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const user = await userModel.findOne({email: email.toLowerCase() })
    if (!user) {
        return next(new AppError('user not exist' , 404))
        
    }
    const code = customAlphabet('0123456789' ,5)
    const newCode = code()
    await sendEmail(email, 'vcode for reset password', `<h1>your code is ${newCode}</h1>`);
    await userModel.updateOne({email}, {code:newCode})
    res.status(200).json({ msg: 'done' });
});


//=========================== reset password============================//
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email , code , password } = req.body
    const user = await userModel.findOne({email: email.toLowerCase() })
    if (!user) {
        return next(new AppError('user not exist' , 404))
        
    }
    if (user.code!==code || code=='') {
        return next(new AppError('invalid code' , 404))
        
    }
    const hash = bcrypt.hashSync(password, 10)


    await userModel.updateOne({email}, {password:hash , code:'' , passwordChangedAt:Date.now()})
    res.status(200).json({ msg: 'done' });
});


//====================sign in============================================//
export const signIn = asyncHandler(async (req, res, next) => {
    const { email ,password } = req.body
    const user = await userModel.findOne({email: email.toLowerCase() , confirmed:true})
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return next(new AppError('user not exist or invalid password' , 404))
        
    }
    const token = jwt.sign({email , role: user.role} ,"generateTokenSecret")
    


    await userModel.updateOne({email}, {loggedIn:true})
    res.status(200).json({ msg: 'done'  , token});
});
