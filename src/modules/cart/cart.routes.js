import express from 'express'
import {   clearCart, createCart,  removeCart} from './cart.controller.js';
import { auth } from '../../middelware/auth.js';
import { validation } from '../../middelware/validation.js';
import { createcartVlidator } from './cart.validator.js';
import { systemRole } from '../../utils/systemRoles.js';
const router = express.Router();

router.post('/createcart',validation(createcartVlidator),auth([systemRole.admin, systemRole.user]) , createCart )
router.put('/removecart',auth([systemRole.admin, systemRole.user]) , removeCart)
router.put('/clearcart',auth([systemRole.admin, systemRole.user]) , clearCart)




export default router