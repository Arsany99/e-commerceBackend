import mongoose, { Types } from 'mongoose'

// Define the User schema
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        minLength: 3,
        maxLength: 30,
        trim: true

    },
    slug: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        minLength: 3,
        maxLength: 30,
        trim: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref:'user',
        required: true
    },
    image: {
        secure_url: String,
        public_id: String
    }, 
    customId:String
 
},{
    timestamps:true,
    versionKey:false
});


const brandModel = mongoose.model('brand', brandSchema)


export default brandModel