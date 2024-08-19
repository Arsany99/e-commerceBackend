import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import copounModel from "../../../db/copoun.model.js";


//=================================== createcopoun =========================//

export const createCopoun = asyncHandler(async (req, res, next) => {
    const { code,amount,fromDate,toDate } = req.body
    const copounExist = await copounModel.findOne({code:code.toLowerCase()})
    if (copounExist) {
        return next(new AppError('copoun already exist' ,409))
    }


    const copoun= await copounModel.create({
        code,
        amount,
        fromDate,
        toDate,
        createdBy:req.userInfo._id
    })
    return res.status(201).json({msg:'done' , copoun})

})


//============================update copoun======================//

export const updateCopoun = asyncHandler(async (req, res, next) => {
    const {id}=req.params
    const { code,amount,fromDate,toDate } = req.body
    const copoun = await copounModel.findOneAndUpdate({_id:id ,createdBy:req.userInfo._id },{
        code,
        amount,
        fromDate,
        toDate,
    },{
        new:true
    })
    if (!copoun) {
        return next(new AppError('copoun not exist or you dont have permission' ,404))
    }

    return res.status(200).json({msg:'done' , copoun})

})


//===================================delete copoun========================//

export const deleteCopoun = asyncHandler(async (req, res, next) => {
    const {id}=req.params
    const copoun = await copounModel.findOneAndDelete({_id:id ,createdBy:req.userInfo._id })
    if (!copoun) {
        return next(new AppError('copoun not exist or you dont have permission' ,404))
    }

    return res.status(200).json({msg:'done' })

})


//============================ get copoun=======================//
export const getCopoun = asyncHandler(async (req, res, next) => {
    const copoun = await copounModel.find({})
    if (!copoun) {
        return next(new AppError('no copoun exist' ,404))
    }

    return res.status(200).json({msg:'done', copoun })

})