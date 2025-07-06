import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import fileUpload from "express-fileupload";
import { ErrorHandler } from "../utils/ErrorHandler";
import { cloudinary } from "../config/cloundinary.config";
import { Layout } from "../models/layout.model";

export const createLayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body
        if (type === "banner") {
            const typeExist = await Layout.find({ type })
            if (!typeExist) {
                return next(new ErrorHandler(`Type ${type} already exist`, 400))
            }
            const { title, subtitle } = req.body
            const image = req.files?.image as fileUpload.UploadedFile
            if (!image) {
                return next(new ErrorHandler("You must include image in banner", 400))
            }
            const myCloud = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "layout"
            })
            const banner: any = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                },
                title,
                subtitle
            }
            await Layout.create(banner)
        }
        if (type === "FAQ") {
            const { faq } = req.body
            const faqItems = await Promise.all(faq.map(async (item: any) => {
                return { question: item.question, answer: item.answer };
            }));
            await Layout.create({ type: "FAQ", faq: faqItems })
        }
        if (type === "Categories") {
            const { categories } = req.body
            const categoryItems = await Promise.all(categories.map(async (item: any) => {
                return { answer: item.title };
            }));
            await Layout.create({ type: "Category", categories: categoryItems },)
        }
        res.status(201).json({
            success: true,
            messge: "Layout Created Successfully"
        })

    } catch (error) {

    }
})
export const editLayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body
        if (type === "banner") {
            const bannerData: any = await Layout.findOne({ type: "banner" })
            if (!bannerData) {
                await cloudinary.uploader.destroy(bannerData.image.public_id)
            }
            const { title, subtitle } = req.body
            const image = req.files?.image as fileUpload.UploadedFile
            if (!image) {
                return next(new ErrorHandler("You must include image in banner", 400))
            }
            const myCloud = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "layout"
            })
            const banner: any = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                },
                title,
                subtitle
            }
            await Layout.findByIdAndUpdate(bannerData.id, { banner })
        }
        if (type === "FAQ") {
            const { faq } = req.body
            const faqItem = await Layout.findOne({ type: "FAQ" })
            const faqItems = await Promise.all(faq.map(async (item: any) => {
                return { question: item.question, answer: item.answer };
            }));
            await Layout.findByIdAndUpdate({ type: "FAQ", faq: faqItems })
        }
        if (type === "Categories") {
            const { categories } = req.body
            const categoriesData = await Layout.findOne({ type: "Categories" })
            const categoryItems = await Promise.all(categories.map(async (item: any) => {
                return { answer: item.title };
            }));
            await Layout.findByIdAndUpdate(categoriesData?._id, { type: "Category", categories: categoryItems },)
        }
        res.status(201).json({
            success: true,
            messge: "Layout Updated Successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.messge, 500))
    }
})
export const getLayoutByType = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const layout = await Layout.find(req.body.type)
        res.status(200).json({
            success: true,
            layout
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.messge, 500))
    }
})