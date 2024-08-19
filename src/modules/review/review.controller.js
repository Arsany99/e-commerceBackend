import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import reviewModel from "../../../db/review.model.js";
import productModel from "../../../db/product.model.js";
import orderModel from "../../../db/order.model.js";


//=================================== createreview =========================//

export const createreview = asyncHandler(async (req, res, next) => {
    const { comment,rate } = req.body
    const { productId } = req.params

    const product = await productModel.findById(productId)
    if (!product) {
        return next(new AppError('product not found' ,404))
    }
    const reviewExist = await reviewModel.findOne({createdBy:req.userInfo._id , productId})
    if (reviewExist) {
        return next(new AppError('review already exist' ,400))
    }
    const order = await orderModel.findOne({
        user:req.userInfo._id,
        "products.productId":productId,
        status:"delivered"
    })
    if (!order) {
        return next(new AppError('order not found' ,400))
    }

    const review= await reviewModel.create({
        comment,
        productId,
        rate,
        createdBy:req.userInfo._id
    })

    let sum = product.rateAvg * product.rateNum
    sum = sum + rate
    product.rateAvg = sum / (product.rateNum+1)
    product.rateNum +=1
    await product.save()
    return res.status(201).json({msg:'done' , review})

})


//===================================delete review========================//

export const deleteReview = asyncHandler(async (req, res, next) => {
    const {id}=req.params
    const review = await reviewModel.findOneAndDelete({_id:id ,createdBy:req.userInfo._id })
    if (!review) {
        return next(new AppError('review not exist ' ,409))
    }
    const product = await productModel.findById(review.productId)
    let sum = product.rateAvg * product.rateNum
    sum = sum - review.rate
    product.rateAvg = sum / (product.rateNum+1)
    product.rateNum -=1
    await product.save()


    return res.status(200).json({msg:'done' })

})


