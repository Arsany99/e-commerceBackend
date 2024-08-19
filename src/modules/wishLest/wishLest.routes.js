import express from 'express'
import {  createwishLest,deletewishLest, removeFromWishLest } from './wishLest.controller.js';
import { auth } from '../../middelware/auth.js';
import { validation } from '../../middelware/validation.js';
import {  createwishLestVlidator, deletewishLestVlidator } from './wishLest.validator.js';
import { systemRole } from '../../utils/systemRoles.js';
const wishLestRouter = express.Router({mergeParams:true});

wishLestRouter.post('/createwishLest',validation(createwishLestVlidator),auth([systemRole.admin]) , createwishLest )
wishLestRouter.put('/removeFromWishLest',validation(createwishLestVlidator),auth([systemRole.admin]) , removeFromWishLest )

 wishLestRouter.delete('/:id',validation(deletewishLestVlidator),auth([systemRole.admin]) , deletewishLest)



export default wishLestRouter