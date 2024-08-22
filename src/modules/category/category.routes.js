import express from 'express'
import { createCategory, dleteCategory, getCategory, updateCategory } from './category.controller.js';
import { auth } from '../../middelware/auth.js';
import { multerHost, validExtension } from '../../middelware/multer.js';
import { validation } from '../../middelware/validation.js';
import { createCategoryVlidator, updateCategoryVlidator } from './category.validator.js';
import  subCategoryRouter  from '../subCategory/subCategory.routes.js';
import { systemRole } from '../../utils/systemRoles.js';
const router = express.Router();

router.use("/:categoryId/subCategory" , subCategoryRouter)
router.post('/createCategory',multerHost(validExtension.image).single('image'),validation(createCategoryVlidator),auth([systemRole.admin]) , createCategory)
router.put('/updateCategory/:id',multerHost(validExtension.image).single('image'),validation(updateCategoryVlidator),auth([systemRole.admin]) , updateCategory)
router.get('/', getCategory)
router.delete('/:id',auth([systemRole.admin, systemRole.user]) , dleteCategory)


export default router