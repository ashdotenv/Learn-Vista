import { Document, Model, model, Schema } from "mongoose";

export interface IOorder extends Document {
    courseId: string
    userId: string
    payment_info: object
}
export const orderSchema = new Schema<IOorder>({
    courseId: { type: String, required: true },
    userId: { type: String, required: true },
    payment_info: {
        type: Object
    }
}, { timestamps: true })
export const Order: Model<IOorder> = model("Order", orderSchema)