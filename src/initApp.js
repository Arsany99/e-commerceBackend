import connectionDB from "../db/connectionDB.js"
import { AppError } from "./utils/classError.js"
import { globalErrorHandling } from "./utils/globalErrorHandling.js"
import * as routers from '../src/modules/index.routes.js'
import { deleteFromCloudinary } from "./utils/deleteFromCloudinary.js"
import { deleteFromDB } from "./utils/deleteFromDB.js"
import cors from 'cors'

export const initApp=(app,express)=>{

app.use(cors())
app.use(express.json())

app.get('/', (req,res)=>{
    res.status(200).json({msg:'hello on my project'})
})

app.use('/users' , routers.userRouter)
app.use('/category' , routers.categoryRouter)
app.use('/subCategory' , routers.subCategory)
app.use('/brands' , routers.brand)
app.use('/products' , routers.product)
app.use('/copoun' , routers.copoun)
app.use('/cart' , routers.cart)
app.use('/order' , routers.order)
app.use('/review' , routers.review)
app.use('/wishlest' , routers.wishLestRouter)




connectionDB()


app.use("*" , (req ,res , next)=>{
    //res.status(404).json({msg:'page not dound'})
    return next(new AppError(`invalid url ${req.originalUrl}`,404))
})
app.use(globalErrorHandling , deleteFromCloudinary , deleteFromDB)




}