import mongoose, { Types } from 'mongoose'

const copounSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'name is required'],
        minLength: 3,
        maxLength: 30,
        trim: true

    },
    createdBy: {
        type: Types.ObjectId,
        ref:'user',
        required: true
    },
    amount:{
        type: Number,
        required: [true, 'amount is required'],
        min:1,
        max:100
    },
    usedBy:[{
        type: Types.ObjectId,
        ref:'user',
        required: true
    }],
    fromDate:{
        type:Date,
        required: [true, 'fromDate is required'],
    },
    toDate:{
        type:Date,
        required: [true, 'toDate is required'],
    }


 
});


const copounModel = mongoose.model('copoun', copounSchema)


export default copounModel