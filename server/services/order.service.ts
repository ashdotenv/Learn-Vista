import { NextFunction, Response } from "express";
import { Order } from "../models/order.model";

export const newOrder = async (data: any, res: Response, next: NextFunction) => {
    const order = await Order.create(data)
    res.status(200).json({
        success: true,
        order
    })
}