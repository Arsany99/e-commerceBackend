import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import wishLestModel from "../../../db/wishLest.model.js";
import productModel from "../../../db/product.model.js";
import orderModel from "../../../db/order.model.js";


//=================================== createwishLest =========================//

export const createwishLest = asyncHandler(async (req, res, next) => {
    const { productId } = req.params

    const product = await productModel.findById(productId)
    if (!product) {
        return next(new AppError('product not found' ,404))
    }
    const wishLestExist = await wishLestModel.findOne({user:req.userInfo._id})
    if (!wishLestExist) {
        const newWishLest = await wishLestModel.create({
            user:req.userInfo._id,
            products:[productId]
        })
        return res.status(201).json({msg:'done' , wishLest:newWishLest})

    }
    const wishLest = await wishLestModel.findOneAndUpdate({user:req.userInfo._id},{
        $addToSet:{products:productId}
    },{
        new:true
    })


 



    return res.status(201).json({msg:'done' , wishLest})

})


//===================================delete wishLest========================//

export const deletewishLest = asyncHandler(async (req, res, next) => {
    const {id}=req.params
    const wishLest = await wishLestModel.findOneAndDelete({_id:id ,createdBy:req.userInfo._id })
    if (!wishLest) {
        return next(new AppError('wishLest not exist ' ,409))
    }
    const product = await productModel.findById(wishLest.productId)
    let sum = product.rateAvg * product.rateNum
    sum = sum - wishLest.rate
    product.rateAvg = sum / (product.rateNum+1)
    product.rateNum -=1
    await product.save()


    return res.status(200).json({msg:'done' })

})

//======================remove from wish lest==================//

export const removeFromWishLest = asyncHandler(async (req, res, next) => {
    const { productId } = req.params

    const product = await productModel.findById(productId)
    if (!product) {
        return next(new AppError('product not found' ,404))
    }
    const wishLestExist = await wishLestModel.findOne({user:req.userInfo._id})
    if (!wishLestExist) {
        const newWishLest = await wishLestModel.create({
            user:req.userInfo._id,
            products:[productId]
        })
        return res.status(201).json({msg:'done' , wishLest:newWishLest})

    }
    const wishLest = await wishLestModel.findOneAndUpdate({user:req.userInfo._id},{
        $pull:{products:productId}
    },{
        new:true
    })


 



    return res.status(201).json({msg:'done' , wishLest})

})