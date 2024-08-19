import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { customAlphabet, nanoid } from "nanoid";
import subCategoryModel from "../../../db/subCategory.model.js";
import slugify from "slugify";
import cloudinary from '../../utils/cloudinary.js'
import categoryModel from "../../../db/category.model.js";

//=================================== createsubCategory =========================//

export const createsubCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    const categoryExist = await categoryModel.findById(req.params.categoryId)
    if (!categoryExist) {
        return next(new AppError('category not exist' ,409))
    }
    const subCategoryExist = await subCategoryModel.findOne({name:name.toLowerCase()})
    if (subCategoryExist) {
        return next(new AppError('subCategory already exist' ,409))
    }
    if (!req.file) {
        return next(new AppError('image is required' , 404))        
    }
    const customId = nanoid(5)
    const {secure_url , public_id}= await cloudinary.uploader.upload(req.file.path,{
        folder:`Ecommercec42/categories/${categoryExist.customId}/subCategory/${customId}`
    })
    const subCategory= await subCategoryModel.create({
        name,
        slug: slugify(name,{
            replacement:"_",
            lower:true
        }),
        image:{secure_url , public_id},
        customId,
        category: req.params.categoryId ,
        createdBy:req.userInfo._id
    })
    return res.status(201).json({msg:'done' , subCategory})

})


//===========================update subCategory========================//

export const updatesubCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    const {id}= req.params
    const categoryExist = await categoryModel.findById(req.params.categoryId)
    if (!categoryExist) {
        return next(new AppError('category not exist' ,409))
    }

    const subCategory = await subCategoryModel.findOne({_id :id , createdBy:req.userInfo._id})
    if (!subCategory) {
        return next(new AppError('subCategory not exist' ,404))
    }
    if (name) {
        if (name.toLowerCase()===subCategory.name) {
            return next(new AppError('name shouid be different' ,400))
        }
        if (await subCategoryModel.findOne({name:name.toLowerCase()})) {
            return next(new AppError('name already exist' ,409))
        }
        subCategory.name= name.toLowerCase()
        subCategory.slug = slugify(name,{
            replacement:"_",
            lower: true
        })
        
    }
    if (req.file) {
        await cloudinary.uploader.destroy(subCategory.image.public_id)
        const {secure_url , public_id}= await cloudinary.uploader.upload(req.file.path,{
            folder:`Ecommercec42/categories/${categoryExist.customId}/subCategory/${subCategory.customId}`
        })
        subCategory.image = {secure_url , public_id}    
    }

    await subCategory.save()



        

    return res.status(200).json({msg:'done' , subCategory})

})

//============================get sub category===========================//
export const getsubCategory = asyncHandler(async (req, res, next) => {
    const subCategory = await subCategoryModel.find({}).populate([
        {
            path: 'category',
            select: 'name -_id',
        },
        {
            path: 'createdBy',
            select: 'name -_id',
        }
    ]);

    return res.status(201).json({ msg: 'done', subCategory });
});


//======================================delete sub category====================//
export const dletesubCategory = asyncHandler(async (req, res, next) => {
    const {id} = req.params
    const categoryExist = await categoryModel.findById(req.params.categoryId)
    if (!categoryExist) {
        return next(new AppError('category not exist' ,409))
    }
    const subcategory = await subCategoryModel.findOneAndDelete({
        _id:id,
        createdBy: req.userInfo._id
    })
    if (!subcategory) {
        return next(new AppError('subcategory not exist or you dont have permission' ,401))
    }
    await cloudinary.api.delete_resources_by_prefix(`Ecommercec42/categories/${categoryExist.customId}/subCategory/${subcategory.customId}`)
    await cloudinary.api.delete_folder(`Ecommercec42/categories/${categoryExist.customId}/subCategory/${subcategory.customId}`)
    return res.status(201).json({ msg: 'done' });
});