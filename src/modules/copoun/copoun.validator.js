import joi   from 'joi'
import { generalField } from '../../utils/generalField.js'

export const createcopounVlidator = {
    body: joi.object({
        code : joi.string().min(3).max(30).required(),
        fromDate:joi.date().greater(Date.now()).required(),
        toDate:joi.date().greater(joi.ref('fromDate')).required(),
        amount:joi.number().min(1).max(100).integer().required(),
    }).required(),
    headers: generalField.headers.required()
}
export const updatecopounVlidator = {
    body: joi.object({
        code : joi.string().min(3).max(30),
        fromDate:joi.date().greater(Date.now()),
        toDate:joi.date().greater(joi.ref('fromDate')),
        amount:joi.number().min(1).max(100).integer(),
    }),
    headers: generalField.headers.required()
}


