import mongoose, { Types } from 'mongoose'

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'comment is required'],
        minLength: 3,
        trim: true

    },
    createdBy: {
        type: Types.ObjectId,
        ref:'user',
        required: true
    },
    rate:{
        type: Number,
        required: [true, 'rate is required'],
        min:1,
        max:100
    },    
    productId: {
        type: Types.ObjectId,
        ref:'product',
        required: true
    },
 
});


const reviewModel = mongoose.model('review', reviewSchema)


export default reviewModel