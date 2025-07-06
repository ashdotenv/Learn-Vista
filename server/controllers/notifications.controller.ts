import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";
import { Notification } from "../models/notification,model";
import cron from "node-cron"
export const getNotifications = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            notifications
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})
export const updateNotification = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await Notification.findById(req.params.id)
        if (!notification) {
            return next(new ErrorHandler("Notification not Found", 404))
        } else {
            notification.status ? notification.status = "read" : notification.status
        }
        await notification.save()
        const notifications = await Notification.find().sort({ createdAt: -1 })
        res.status(201).json({
            success: true,
            notifications
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})
cron.schedule("*0 0 0 * * *", async function () {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    await Notification.deleteMany({
        status: "reade",
        createdAt: { $lt: thirtyDaysAgo }
    })
    console.log("Deleted Notifications from 30 Days Ago");
})