import jwt  from 'jsonwebtoken'
import userModel from '../../db/user.model.js'




export const auth = (roles=[])=>{
    return async (req,res,next)=>{
        const {token } = req.headers
        if (!token) {
            return res.status(400).json({msg:'token is not exist'})
        }
        if (!token.startsWith(process.env.BARRERKEY)) {
            return res.status(400).json({msg:"token not valid"})
        }
        const newToken = token.split(process.env.BARRERKEY)[1]
        if (!newToken) {
            return res.status(400).json({msg:"token not found"})
            
        }
        const decoded = jwt.verify(newToken , 'generateTokenSecret')
        if (!decoded.email) {
            return res.status(400).json({msg:"invalid payload"})
            
        }
        const user = await userModel.findOne({email:decoded.email})
        if (!user) {
            return res.status (409).json({msg:'invalid user'})
        }
        //=======Authorization===============/
        if (!roles.includes(user.role)) {
            return res.status(401).json({msg:'you dont have permission'})
        }
        if (user.passwordChangedAt && parseInt(user?.passwordChangedAt?.getTime() / 1000) > decoded.iat) {
            return res.status(403).json({ msg: 'Token expired, please log in again' });
        }
        req.userInfo = user
        next()
    

    }

}