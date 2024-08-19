import express from 'express'
import {  createreview,deleteReview } from './review.controller.js';
import { auth } from '../../middelware/auth.js';
import { validation } from '../../middelware/validation.js';
import {  createReviewVlidator, deleteReviewVlidator } from './review.validator.js';
import { systemRole } from '../../utils/systemRoles.js';
const reviewRouter = express.Router({mergeParams:true});

reviewRouter.post('/createreview',validation(createReviewVlidator),auth([systemRole.admin]) , createreview )
 reviewRouter.delete('/:id',validation(deleteReviewVlidator),auth([systemRole.admin]) , deleteReview)



export default reviewRouter