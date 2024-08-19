import mongoose, { Types } from 'mongoose'

const orderSchema = new mongoose.Schema({

    user: {
        type: Types.ObjectId,
        ref:'user',
        required: true
    },

    products:[{
        title : {type:String , required:true},
        productId:{type: Types.ObjectId,ref:'user',required: true},
        quantatity:{type:Number , required:true},
        price:{type:Number , required:true},
        finalPrice:{type:Number , required:true}
    }],
    subPrice:{type:Number , required:true},
    copounId:{type: Types.ObjectId, ref:"copoun"},
    totalPrice:{type:String , required: true},
    address:{type:String , required: true},
    phone:{type:String , required: true},
    paymentMethod:{type:String , required: true , enum:['card' , 'cash']},
    status:{
        type:String , 
        enum:['placed','waittPayment','delivred','onWay','cancelled','rejected'],
        default:'placed'

    },
    cancelledBy:{
        type: Types.ObjectId,
        ref:'user',
    },
    reason:{type:String}



 
});


const orderModel = mongoose.model('order', orderSchema)


export default orderModel