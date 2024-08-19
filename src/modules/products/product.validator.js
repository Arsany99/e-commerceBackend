import joi  from 'joi'
import { generalField } from '../../utils/generalField.js'

export const createproductVlidator = {
    body: joi.object({
        title : joi.string().min(3).max(30).required(),
        stock: joi.number().min(1).integer().required(),
        discount:joi.number().min(1).max(100).required(),
        price : joi.number().min(1).integer().required(),
        brand:generalField.id.required(),
        category:generalField.id.required(),
        subCategory:generalField.id.required(),
        description:joi.string()
    }).required(),
    files:joi.object({
        image:joi.array().items(generalField.file.required()).required(),
        coverImage : joi.array().items(generalField.file.required()).required()
    }).required(),

    headers: generalField.headers.required()
}


export const updateProductVlidator = {
    body: joi.object({
        title : joi.string().min(3).max(30),
        stock: joi.number().min(1).integer(),
        discount:joi.number().min(1).max(100),
        price : joi.number().min(1).integer(),
        brand:generalField.id.required(),
        category:generalField.id.required(),
        subCategory:generalField.id.required(),
        description:joi.string()
    }).required(),
    files:joi.object({
        image:joi.array().items(generalField.file),
        coverImage : joi.array().items(generalField.file)
    }),
    params : joi.object({
        id:generalField.id.required()
    }),
    headers: generalField.headers.required()
}
