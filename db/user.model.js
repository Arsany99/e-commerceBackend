import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        minLength: 3,
        maxLength: 15,
        trim: true

    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
       lowercase: true
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    cpassword: {
        type: String,
    },
    age: {
        type: Number,
        required: [true, 'age is required'],
    },
    phone: [String],
    address: [String],

    role: {
        type: String,
        enum :['user' , 'admin'],
        default: 'user'
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    loggedIn: {
        type: Boolean,
        default: false
    },
    code:{
        type:String
    },
    passwordChangedAt:{
        type:Date
    }
});


const userModel = mongoose.model('user', userSchema)


export default userModel