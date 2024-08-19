import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { customAlphabet, nanoid } from "nanoid";
import productModel from "../../../db/product.model.js";
import slugify from "slugify";
import cloudinary from '../../utils/cloudinary.js'
import categoryModel from "../../../db/category.model.js";
import subCategoryModel from "../../../db/subCategory.model.js";
import brandModel from "../../../db/brand.model.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";

//=================================== createproduct =========================//

export const createproduct = asyncHandler(async (req, res, next) => {
    const { title, category, subCategory, brand, discount, stock, price, description, rateAvg } = req.body;
    
    const categoryExist = await categoryModel.findById(category);
    if (!categoryExist) {
        return next(new AppError('Category does not exist', 409));
    }

    const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category });
    if (!subCategoryExist) {
        return next(new AppError('Subcategory does not exist', 409));
    }

    const brandExist = await brandModel.findById(brand);
    if (!brandExist) {
        return next(new AppError('Brand does not exist', 409));
    }

    const productExist = await productModel.findOne({ title: title.toLowerCase() });
    if (productExist) {
        return next(new AppError('Product already exists', 409));
    }

    const subPrice = price - (price * (discount || 0) / 100);

    if (!req.files || !req.files.coverImage || !req.files.image) {
        return next(new AppError('Images are required', 404));
    }

    const customId = nanoid(5);
    let coverImageList = [];

    for (const file of req.files.coverImage) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `Ecommercec42/categories/${categoryExist.customId}/subCategory/${subCategoryExist.customId}/product/${customId}/mainimage`
        });

        coverImageList.push({ secure_url, public_id });
    }

    const mainImageFile = req.files.image[0];
    const mainImageUpload = await cloudinary.uploader.upload(mainImageFile.path, {
        folder: `Ecommercec42/categories/${categoryExist.customId}/subCategory/${subCategoryExist.customId}/product/${customId}/coverimage`
    });

    const { secure_url, public_id } = mainImageUpload;

    const product = await productModel.create({
        title,
        slug: slugify(title, {
            replacement: '_',
            lower: true
        }),
        description,
        price,
        discount,
        subPrice,
        stock,
        category,
        subCategory,
        brand,
        image: { secure_url, public_id },
        coverImage: coverImageList,
        customId,
        rateAvg,
        createdBy: req.userInfo._id
    });

    return res.status(201).json({ msg: 'Product created successfully', product });
});


//===========================get product pagination========================//

export const getproduct = asyncHandler(async (req, res, next) => {
    const apiFeature = new ApiFeatures(productModel.find() , req.query).pagination()
    .filter()
    .search()
    .sort()
    .select()



    const products = await apiFeature.mongooseQuery


        

    return res.status(200).json({msg:'done',page : apiFeature.page , products})

})
///======================update product========================//

export const updateproduct = asyncHandler(async (req, res, next) => {
    const { title, category, subCategory, brand, discount, stock, price, description, rateAvg } = req.body;
    const {id} = req.params
    
    const categoryExist = await categoryModel.findById(category);
    if (!categoryExist) {
        return next(new AppError('Category does not exist', 409));
    }

    const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category });
    if (!subCategoryExist) {
        return next(new AppError('Subcategory does not exist', 409));
    }

    const brandExist = await brandModel.findById(brand);
    if (!brandExist) {
        return next(new AppError('Brand does not exist', 409));
    }

    const product = await productModel.findOne({ _id: id , createdBy : req.userInfo._id});
    if (!product) {
        return next(new AppError('Product not exists', 409));
    }
    if (title) {
        if (title.toLowerCase == product.title) {
            return next(new AppError('title match old title', 409));

        }
        if (await productModel.findOne({title:title.toLowerCase()})) {
            return next(new AppError('title ALREADY EXIST  BEFORE', 409));
        }
        product.title = title.toLowerCase()
        product.slug =slugify(title, {
            replacement: '_',
            lower: true
        })
    }
    if (description) {
        product.description = description
    }
    if (stock) {
        product.stock = stock
    }
    if (price & discount) {
        product.subPrice = price - (price * (discount/ 100));
        product.price = price
        product.discount = discount
    }else if (price) {
        product.subPrice = price - (price * (product.discount/ 100));
        product.price = price
    }else if (discount) {
        product.subPrice = product.price - (product.price * (discount/ 100));
        product.discount = discount
    }
    if (req.files) {
        if (req.files?.image?.length) {
            await cloudinary.uploader.destroy(product.image.public_id)
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path,{
                folder:`Ecommercec42/categories/${categoryExist.customId}/subCategory/${subCategoryExist.customId}/product/${product.customId}/mainimage`
            })
            product.image = {secure_url, public_id}
        }
        if (req.files?.coverImage?.length) {
            await cloudinary.api.delete_resources_by_prefix(`Ecommercec42/categories/${categoryExist.customId}/subCategory/${subCategoryExist.customId}/product/${product.customId}/coverimage`)
            let coverImageList = [];

            for (const file of req.files.coverImage) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                    folder: `Ecommercec42/categories/${categoryExist.customId}/subCategory/${subCategoryExist.customId}/product/${product.customId}/coverimage`
                });
        
                coverImageList.push({ secure_url, public_id });
            }
        }
    }
    await product.save()

    
    return res.status(201).json({ msg: 'Product updated successfully', product });
});

