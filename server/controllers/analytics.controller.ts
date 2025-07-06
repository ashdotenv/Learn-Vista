import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import { User } from "../models/user.model";
import { Course } from "../models/course.model";
import { Order } from "../models/order.model";

export const getUserAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MonthsData(User)
        res.json(200).json({
            success: true,
            users
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})
export const getCoursesAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MonthsData(Course)
        res.json(200).json({
            success: true,
            users
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})
export const getOrdersAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MonthsData(Order)
        res.json(200).json({
            success: true,
            users
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})