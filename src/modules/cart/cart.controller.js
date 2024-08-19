import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import cartModel from "../../../db/cart.model.js";
import productModel from "../../../db/product.model.js";


//=================================== createcart =========================//

export const createCart = asyncHandler(async (req, res, next) => {
    const { productId ,quantatity } = req.body
    const product = await productModel.findOne({_id:productId,stock:{$gte:quantatity}})
    if (!product) {
        return next(new AppError('product not exist or out of stock' ,404))

    }
    const cartExist = await cartModel.findOne({user:req.userInfo._id})
    if (!cartExist) {
        const cart = await cartModel.create({
            user:req.userInfo._id,
            products:[{
                productId,quantatity
            }]
        })
        return res.status(201).json({msg:'done' , cart})
    }
    let flag = false 
    for (const product of cartExist.products) {
        if (productId==product.productId) {
            product.quantatity=quantatity
            flag= true
        }
    }

    if (!flag) {
        cartExist.products.push({
            productId,
            quantatity
        })
    }


    await cartExist.save()
    return res.status(201).json({msg:'done' , cartExist})




})


//================================ remove cart===================================//

export const removeCart = asyncHandler(async (req, res, next) => {
    const { productId  } = req.body
    const cartExist = await cartModel.findOneAndUpdate({user:req.userInfo._id , "products.productId":productId},{
        $pull:{products:{productId}}
    },{
        new:true
    })
    return res.status(201).json({msg:'done' , cartExist})

})


//=========================clear cart===========================//
export const clearCart = asyncHandler(async (req, res, next) => {
    const cartExist = await cartModel.findOneAndUpdate({user:req.userInfo._id},{
        products:[]}
    ,{
        new:true
    })
    if (!cartExist) {
        return next(new AppError('cart not exist' ,404))
    }
    return res.status(201).json({msg:'done' , cartExist})

})




