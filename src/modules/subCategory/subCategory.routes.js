import express from 'express'
import { createsubCategory, dletesubCategory, getsubCategory, updatesubCategory } from './subCategory.controller.js';
import { auth } from '../../middelware/auth.js';
import { multerHost, validExtension } from '../../middelware/multer.js';
import { validation } from '../../middelware/validation.js';
import { createsubCategoryVlidator, updatesubCategoryVlidator } from './subCategory.validator.js';
import { systemRole } from '../../utils/systemRoles.js';
const router = express.Router({mergeParams:true});


router.post('/createsubCategory',multerHost(validExtension.image).single('image'),validation(createsubCategoryVlidator),auth([systemRole.admin]) , createsubCategory)
router.put('/updatesubCategory/:id',multerHost(validExtension.image).single('image'),validation(updatesubCategoryVlidator),auth([systemRole.admin]) , updatesubCategory)
router.delete('/:id',auth([systemRole.admin]) , dletesubCategory)

router.get('/',auth([systemRole.admin, systemRole.user]) , getsubCategory)


export default router