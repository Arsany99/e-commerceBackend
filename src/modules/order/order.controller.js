import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import orderModel from "../../../db/order.model.js";
import productModel from "../../../db/product.model.js";
import copounModel from "../../../db/copoun.model.js";
import cartModel from "../../../db/cart.model.js";
import { createInvoice } from "../../utils/pdf.js";
import { sendEmail } from "../../services/sendEmail.js";
import { payment } from "../../utils/payment.js";
import Stripe from "stripe";



//=================================== createorder =========================//

export const createorder = asyncHandler(async (req, res, next) => {
    const { productId ,quantatity , paymentMethod,phone ,address, copounCode } = req.body
    if (copounCode) {
        const copoun = await copounModel.findOne({code:copounCode.toLowerCase() , usedBy:{$nin :[req.userInfo_id]}})
        if (!copoun || copoun.toDate < Date.now()) {
            return next(new AppError('copoun not exist ' ,404))
        }
        req.body.copoun = copoun
    }
    let products = []
    let flag = false
    if (productId) {
        products = [{productId , quantatity}]
    }
    else{
        const cart = await cartModel.findOne({user:req.userInfo._id})
        if (!cart.products.length) {
            return next(new AppError('cart is empty' ,404))

        }
        products = cart.products
        flag = true

    }
    let finalProduct =[]
    let subPrice =0
    for (const product of products) {
        const checkproduct = await productModel.findOne({_id:productId,stock:{$gte:quantatity}})
        if (!checkproduct) {
            return next(new AppError('product not exist or out of stock' ,404))
        }
        if (flag) {
            product = product.toObject()
        }
        product.title = checkproduct.title
        product.price = checkproduct.price
        product.finalPrice = checkproduct.subPrice*product.quantatity
        subPrice += product.finalPrice

        finalProduct.push(product)
    }

    const order =await orderModel.create({
        user:req.userInfo._id,
        products:finalProduct,
        subPrice,
        copounId:req.body?.copoun?._id,
        totalPrice:subPrice-subPrice*((req.body.copoun?.amount || 0)/100),
        paymentMethod,
        status:paymentMethod=="cash"?"placed":"waittPayment",
        phone,
        address
    })
    if (req.body?.copoun) {
        await copounModel.updateOne({_id:req.body.copoun._id} ,{
            $push:{usedBy:req.userInfo._id}
        })
    }
    for (const product of finalProduct) {
        await productModel.findByIdAndUpdate({_id:product.productId},{
            $inc:{stock:-product.quantatity}
        })

    }
    if (flag) {
        await cartModel.updateOne({user:req.userInfo._id},{products:[]} )
    }


    const invoice = {
    shipping: {
        name: req.userInfo.name,
        address: order.address,
        city: "egypt",
        state: "alex",
        country: "alex",
        postal_code: 94111
    },
    items: order.products,
    subtotal: order.subPrice,
    paid: order.totalPrice,
    invoice_nr: order._id,
    copoun : req.body?.copoun?.amount
    };

    await createInvoice(invoice, "invoice.pdf");
    await sendEmail(req.userInfo.email ,'order placed' ,'your order has been placed succesfully',[{
        path:"invoice.pdf",
        contentType:"application/pdf"
    },{
        path:"route.jpg",
        contentType:"image/jpg"
    }])

    if (paymentMethod=='card') {
        const stripe = new Stripe(process.env.stripe_secret);
        if (req.body?.copoun) {
            const copoun = await stripe.coupons.create({
                percent_off:req.body.copoun.amount,
                duration:"once"
            })
            req.body.copounId=copoun.id
        }

        const session = await payment({
            stripe,
            payment_method_types:['card'],
            mode:"payment",
            customer_email:req.userInfo.email,
            metadata:{
                orderId:order._id.toString()
            },
            success_url:`${req.protocol}://${req.headers.host}/orders/success/${order._id}`,
            cancel_url:`${req.protocol}://${req.headers.host}/orders/cancel/${order._id}`,
            line_items:order.products.map((product)=>{
                return {
                        
                        price_data:{
                            currency:"egp",
                            product_data:{
                                name:product.title
                            },
                            unit_amount:product.price*100
                        },
                        quantity:product.quantatity,
                    }
                }),
                discounts:req.body?.copoun?[{copoun:req.body.copounId}]:[]
            })
            res.status(201).json({msg:"done" , url:session.url , session})
        }
    






    res.status(201).json({msg:"done" , order})






})


//================================ cancel order===================================//

export const cancelOrder = asyncHandler(async (req, res, next) => {
    const {id} = req.params
    const {reason} = req.body
    const order = await orderModel.findOne({_id:id , user:req.userInfo._id})
    if (!order) {
        return next(new AppError('order not found' ,404))

    }
    if ((order.paymentMethod==='cash'&& order.status!="placed")||(order.paymentMethod==='card'&& order.status!="waittPayment")) {
        return next(new AppError('you can not cancel this order' ,400))
    }

    await orderModel.updateOne({_id : id},{
        status:'cancalled',
        cancelledBy:req.userInfo._id,
        reason
    })
    if (order?.copounId) {
        await copounModel.updateOne({_id:order?.copounId} ,{
            $pull:{usedBy:req.userInfo._id}
        })
    }
    for (const product of order.products) {
        await productModel.findByIdAndUpdate({_id:product.productId},{
            $inc:{stock:product.quantatity}
        })

    }
    res.status(200).json({msg:"done"})



})



//===============================web hook======================//

export const webHook = asyncHandler(async (req, res, next) => {
        const stripe = new Stripe(process.env.stripe_secret);
    
        const sig = req.headers['stripe-signature'];
      
        let event;
      
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, process.env.endpointSecret);
        } catch (err) {
          res.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }
      
        const {orderId} = event.data.object.metadata;
        if (event.type !== 'checkout.session.completed') {
            await orderModel.findOneAndUpdate({_id:orderId},{status:"rejected"})
            return res.status(400).json({msg:'fail'})
            // const checkoutSessionCompleted = event.data.object;      
        }
        await orderModel.findOneAndUpdate({_id:orderId},{status:'placed'})
        return res.status(200).json({msg:'done'})

      
      });

