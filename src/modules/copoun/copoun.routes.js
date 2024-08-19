import express from 'express'
import {  createCopoun, deleteCopoun, getCopoun, updateCopoun} from './copoun.controller.js';
import { auth } from '../../middelware/auth.js';
import { validation } from '../../middelware/validation.js';
import { createcopounVlidator, updatecopounVlidator } from './copoun.validator.js';
import { systemRole } from '../../utils/systemRoles.js';
const router = express.Router();

router.get('/',auth(['admin']) , getCopoun)
router.post('/createcopoun',validation(createcopounVlidator),auth([systemRole.admin]) , createCopoun )
router.put('/updatecopoun/:id',validation(updatecopounVlidator),auth([systemRole.admin]) , updateCopoun)
router.delete('/:id',auth([systemRole.admin]) , deleteCopoun)



export default router