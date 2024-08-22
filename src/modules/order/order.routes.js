import express from 'express'
import {   cancelOrder,  createorder, webHook,  } from './order.controller.js';
import { auth } from '../../middelware/auth.js';
import { validation } from '../../middelware/validation.js';
import { cancelorderVlidator, createorderVlidator } from './order.validator.js';
import { systemRole } from '../../utils/systemRoles.js';
const router = express.Router();

router.post('/createorder',validation(createorderVlidator),auth([systemRole.admin, systemRole.user]) , createorder )
router.put('/cancelorder/:id',validation(cancelorderVlidator),auth([systemRole.admin, systemRole.user]) , cancelOrder)




app.post('/webhook', express.raw({type: 'application/json'}), webHook )



export default router