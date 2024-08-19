import joi  from 'joi'
import { generalField } from '../../utils/generalField.js'

export const createsubCategoryVlidator = {
    body: joi.object({
        name : joi.string().min(3).max(30).required(),
    }).required(),
    params : joi.object({
        categoryId:generalField.id.required()
    }),
    File:generalField.file.required(),
    headers: generalField.headers.required()
}


export const updatesubCategoryVlidator = {
    body: joi.object({
        name : joi.string().min(3).max(30),
    }).required(),
    File:generalField.file,
    headers: generalField.headers.required()
}