import joi   from 'joi'
import { generalField } from '../../utils/generalField.js'

export const createReviewVlidator = {
    body: joi.object({
        comment : joi.string().min(3).max(30).required(),
        rate:joi.number().min(1).max(5).integer().required(),
    }).required(),
    params:joi.object({
        productId:generalField.id.required()
    }).required(),
    headers: generalField.headers.required()
}


export const deleteReviewVlidator = {
    params: joi.object({
        id : joi.string().min(3).max(30)
    }).required(),
    headers: generalField.headers.required()
}