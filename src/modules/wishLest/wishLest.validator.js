import joi   from 'joi'
import { generalField } from '../../utils/generalField.js'

export const createwishLestVlidator = {
    params:joi.object({
        productId:generalField.id.required()
    }).required(),
    headers: generalField.headers.required()
}


export const deletewishLestVlidator = {
    params: joi.object({
        id : joi.string().min(3).max(30)
    }).required(),
    headers: generalField.headers.required()
}