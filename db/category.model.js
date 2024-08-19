import mongoose, { Types } from 'mongoose'

// Define the User schema
const categorySchema = new mongoose.Schema({
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
    toJSON:true,  
    toObject: true   
});

categorySchema.virtual('subcategories' , {
    ref:"subCategory",  
    localField:'_id', 
    foreignField:'category' 
})



const categoryModel = mongoose.model('category', categorySchema)


export default categoryModel