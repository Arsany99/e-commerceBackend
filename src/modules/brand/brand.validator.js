import joi  from 'joi'
import { generalField } from '../../utils/generalField.js'

export const createBrandVlidator = {
    body: joi.object({
        name : joi.string().min(3).max(30).required()
    }).required(),
    File:generalField.file.required(),
    headers: generalField.headers.required()
}


export const updateBrandVlidator = {
    body: joi.object({
        name : joi.string().min(3).max(30)
    }).required(),
    File:generalField.file,
    headers: generalField.headers.required()
}