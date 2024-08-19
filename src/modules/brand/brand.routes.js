import express from 'express'
import { createBrand, deleteBrand, getbrands, updateBrand } from './brand.controller.js';
import { auth } from '../../middelware/auth.js';
import { multerHost, validExtension } from '../../middelware/multer.js';
import { validation } from '../../middelware/validation.js';
import { createBrandVlidator, updateBrandVlidator } from './brand.validator.js';
import { systemRole } from '../../utils/systemRoles.js';
const router = express.Router();


router.post('/createbrand',multerHost(validExtension.image).single('image'),validation(createBrandVlidator),auth(['admin']) , createBrand)
router.put('/updatebrand/:id',multerHost(validExtension.image).single('image'),validation(updateBrandVlidator),auth(['admin']) , updateBrand)
router.delete('/:id',auth([systemRole.admin]) , deleteBrand)
router.get('/',auth([systemRole.admin ,systemRole.user]) , getbrands)


export default router