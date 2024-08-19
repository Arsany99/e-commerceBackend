import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { customAlphabet, nanoid } from "nanoid";
import categoryModel from "../../../db/category.model.js";
import slugify from "slugify";
import cloudinary from '../../utils/cloudinary.js'
import subCategoryModel from "../../../db/subCategory.model.js";

//=================================== createCategory =========================//

export const createCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    const categoryExist = await categoryModel.findOne({name:name.toLowerCase()})
    if (categoryExist) {
        return next(new AppError('category already exist' ,409))
    }
    if (!req.file) {
        return next(new AppError('image is required' , 404))        
    }
    const customId = nanoid(5)
    const {secure_url , public_id}= await cloudinary.uploader.upload(req.file.path,{
        folder:`Ecommercec42/categories/${customId}`
    })
    req.filePath = `Ecommercec42/categories/${customId}`

    const category= await categoryModel.create({
        name,
        slug: slugify(name,{
            replacement:"_",
            lower:true
        }),
        image:{secure_url , public_id},
        customId,
        createdBy:req.userInfo._id
    })
    req.data ={
        model: categoryModel,
        id : category._id
    }


    const x = 4
    x=5
    return res.status(201).json({msg:'done' , category})

})


//===========================update category========================//

export const updateCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    const {id}= req.params

    const category = await categoryModel.findOne({_id :id , createdBy:req.userInfo._id})
    if (!category) {
        return next(new AppError('category not exist' ,404))
    }
    if (name) {
        if (name.toLowerCase()===category.name) {
            return next(new AppError('name shouid be different' ,400))
        }
        if (await categoryModel.findOne({name:name.toLowerCase()})) {
            return next(new AppError('name already exist' ,409))
        }
        category.name= name.toLowerCase()
        category.slug = slugify(name,{
            replacement:"_",
            lower: true
        })
        
    }
    if (req.file) {
        await cloudinary.uploader.destroy(category.image.public_id)
        const {secure_url , public_id}= await cloudinary.uploader.upload(req.file.path,{
            folder:`Ecommercec42/categories/${category.customId}`
        })
        category.image = {secure_url , public_id}    
    }

    await category.save()



        

    return res.status(200).json({msg:'done' , category})

})


//==========================================get category=============================//
export const getCategory = asyncHandler(async (req, res, next) => {
    const categories = await categoryModel.find({}).populate([
        {path:"subcategories"}
    ])
    // const list =[]
    // for (const category of categories) {
    //     const subCategory = await subCategoryModel.find({category:category._id})
    //     const newCategory = category.toObject()
    //     newCategory.subCategory = subCategory
    //     list.push(newCategory)
        
    // }
    return res.status(201).json({ msg: 'done', categories:list });
});

//===============================delete category===========================//
export const dleteCategory = asyncHandler(async (req, res, next) => {
    const {id} = req.params
    const category = await categoryModel.findOneAndDelete({
        _id:id,
        createdBy: req.userInfo._id
    })
    if (!category) {
        return next(new AppError('category not exist or you dont have permission' ,401))
    }
    await subCategoryModel.deleteMany({category:category._id})
    await cloudinary.api.delete_resources_by_prefix(`Ecommercec42/categories/${category.customId}`)
    await cloudinary.api.delete_folder(`Ecommercec42/categories/${category.customId}`)
    return res.status(201).json({ msg: 'done' });
});