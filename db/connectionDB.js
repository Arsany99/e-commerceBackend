import mongoose from 'mongoose'


const connectionDB = async ()=>{   
    return await mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log(`database connected)${process.env.DB_URL}`);
    }).catch((err)=>{
        console.log(err , 'databade connection error');
    })
}



export default connectionDB