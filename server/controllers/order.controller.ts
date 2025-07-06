import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";
import { IOorder } from "../models/order.model";
import { User } from "../models/user.model";
import { Course } from "../models/course.model";
import { newOrder } from "../services/order.service";
import ejs from "ejs"
import path from "path";
import { sendEmail } from "../utils/sendEmail";
import { Notification } from "../models/notification,model";

export const createOrder = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, payment_info } = req.body as IOorder
        const user = await User.findById(req.user?._id)
        const courseExist = user?.courses.find((course: any) => course._id.toString() === courseId)
        if (courseExist) {
            return next(new ErrorHandler("You've already purchased this course", 400))
        }
        const course = await Course.findById(courseId)
        if (!course) {
            return next(new ErrorHandler("Course not found", 404))
        }
        const data: any = {
            courseId: courseId,
            userId: req.user?._id,
            payment_info
        }
        const mailData = {
            order: {
                _id: course._id,
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            }
        }

        const html = await ejs.renderFile(path.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData })
        try {
            if (user) {
                await sendEmail({
                    email: user.email,
                    subject: "Order-Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData
                })
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
        user?.courses.push({ courseId: course._id as string })
        await user?.save()
        await Notification.create({
            userId: user?._id,
            title: "New Order",
            message: `You habe a new Order From ${course.name}`
        })
        newOrder(data, res, next)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})