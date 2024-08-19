import mongoose, { Types } from 'mongoose'

const subCategorySchema = new mongoose.Schema({
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
    category:{
        type: Types.ObjectId,
        ref :'category',
        required: true

    }, 
    customId:String
 
});


const subCategoryModel = mongoose.model('subCategory', subCategorySchema)


export default subCategoryModel