import joi   from 'joi'
import { generalField } from '../../utils/generalField.js'

export const createorderVlidator = {
    body: joi.object({
        productId : generalField.id,
        quantatity:joi.number().min(1).max(100).integer(),
        phone : joi.string().required(),
        address:joi.string().required(),
        copounCode:joi.string().min(3),
        paymentMethod:joi.string().valid("card" , "cash").required(),
    }).required(),
    headers: generalField.headers.required()
}

export const cancelorderVlidator = {
    body: joi.object({
        reason : joi.string().required(),
    }).required(),
    params:joi.object({
        id:generalField.id.required()
    }),
    headers: generalField.headers.required()
}
