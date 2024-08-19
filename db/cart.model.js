import mongoose, { Types } from 'mongoose'

// Define the User schema
const cartSchema = new mongoose.Schema({

    user: {
        type: Types.ObjectId,
        ref:'user',
        required: true
    },

    products:[{
        productId:{type: Types.ObjectId,ref:'user',required: true},
        quantatity:{type:Number , required:true}
    }],



 
},{
    timestamps:true,
    versionKey:false
});

// Create the User model

const cartModel = mongoose.model('cart', cartSchema)


export default cartModel