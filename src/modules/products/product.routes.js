import express from 'express'
import { createproduct, getproduct, updateproduct} from './product.controller.js';
import { auth } from '../../middelware/auth.js';
import { multerHost, validExtension } from '../../middelware/multer.js';
import { validation } from '../../middelware/validation.js';
import { createproductVlidator, updateProductVlidator } from './product.validator.js';
import reviewRouter from '../review/review.routes.js';
import wishLestRouter from '../wishLest/wishLest.routes.js';
import { systemRole } from '../../utils/systemRoles.js';
const router = express.Router({mergeParams:true});

router.use("/:productId/review" , reviewRouter)
router.use("/:productId/wishLest" , wishLestRouter)


router.post('/createproduct',multerHost(validExtension.image).fields([
    {name:'image' , maxCount:1},
    {name: 'coverImage' , maxCount:3},
]),validation(createproductVlidator),auth([systemRole.admin]) , createproduct)
router.put('/updateproduct/:id',multerHost(validExtension.image).fields([
    {name:'image' , maxCount:1},
    {name: 'coverImage' , maxCount:3},
]),validation(updateProductVlidator),auth([systemRole.admin]) , updateproduct)


 router.get('/',auth([systemRole.admin, systemRole.user]) , getproduct)


export default router