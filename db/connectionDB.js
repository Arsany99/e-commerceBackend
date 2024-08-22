import mongoose from 'mongoose'


const connectionDB = async ()=>{   
    return await mongoose.connect(process.env.DB_URL_ONLINE)
    .then(()=>{
        console.log(`database connected)${process.env.DB_URL_ONLINE}`);
    }).catch((err)=>{
        console.log(err , 'databade connection error');
    })
}



export default connectionDB