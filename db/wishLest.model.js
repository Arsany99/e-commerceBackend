import mongoose, { Types } from 'mongoose'

const wishLestSchema = new mongoose.Schema({
    user: {
        type: Types.ObjectId,
        ref:'user',
        required: true
    }, 
    products: [{
        type: Types.ObjectId,
        ref:'product',
        required: true
    }],
 
});


const wishLestModel = mongoose.model('wishLest', wishLestSchema)


export default wishLestModel