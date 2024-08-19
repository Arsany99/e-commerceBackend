import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { customAlphabet, nanoid } from "nanoid";
import brandModel from "../../../db/brand.model.js";
import slugify from "slugify";
import cloudinary from '../../utils/cloudinary.js'

//=================================== createbrand =========================//

export const createBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    const brandExist = await brandModel.findOne({name:name.toLowerCase()})
    if (brandExist) {
        return next(new AppError('brand already exist' ,409))
    }
    if (!req.file) {
        return next(new AppError('image is required' , 404))        
    }
    const customId = nanoid(5)
    const {secure_url , public_id}= await cloudinary.uploader.upload(req.file.path,{
        folder:`Ecommercec42/brands/${customId}`
    })
    const brand= await brandModel.create({
        name,
        slug: slugify(name,{
            replacement:"_",
            lower:true
        }),
        image:{secure_url , public_id},
        customId,
        createdBy:req.userInfo._id
    })
    return res.status(201).json({msg:'done' , brand})

})


//===========================update brand========================//

export const updateBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    const {id}= req.params

    const brand = await brandModel.findOne({_id :id , createdBy:req.userInfo._id})
    if (!brand) {
        return next(new AppError('brand not exist' ,404))
    }
    if (name) {
        if (name.toLowerCase()===brand.name) {
            return next(new AppError('name shouid be different' ,400))
        }
        if (await brandModel.findOne({name:name.toLowerCase()})) {
            return next(new AppError('name already exist' ,409))
        }
        brand.name= name.toLowerCase()
        brand.slug = slugify(name,{
            replacement:"_",
            lower: true
        })
        
    }
    if (req.file) {
        await cloudinary.uploader.destroy(brand.image.public_id)
        const {secure_url , public_id}= await cloudinary.uploader.upload(req.file.path,{
            folder:`Ecommercec42/brands/${brand.customId}`
        })
        brand.image = {secure_url , public_id}    
    }

    await brand.save()



        

    return res.status(200).json({msg:'done' , brand})

})


//=======================================delete brand==========================//
export const deleteBrand = asyncHandler(async (req, res, next) => {
    const {id} = req.params

    const brand = await brandModel.findOneAndDelete({
        _id:id,
        createdBy: req.userInfo._id
    })
    if (!brand) {
        return next(new AppError('brand not exist or you dont have permission' ,401))
    }
    await cloudinary.api.delete_resources_by_prefix(`Ecommercec42/brands/${brand.customId}`)
    await cloudinary.api.delete_folder(`Ecommercec42/brands/${brand.customId}`)
    return res.status(201).json({ msg: 'done' });
})

//=================================get brand =======================//
export const getbrands = asyncHandler(async (req, res, next) => {
    const brands = await brandModel.find({}).populate([
        {path:"createdBy",
            select:"-_id"
        }
    ])

    return res.status(201).json({ msg: 'done', brands });
});