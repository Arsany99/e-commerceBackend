import joi   from 'joi'
import { generalField } from '../../utils/generalField.js'

export const createcartVlidator = {
    body: joi.object({
        productId : generalField.id.required(),
        quantatity:joi.number().min(1).max(100).integer().required(),
    }).required(),
    headers: generalField.headers.required()
}

