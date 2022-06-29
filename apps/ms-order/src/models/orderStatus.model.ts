import mongoose from "mongoose";

export interface OrderStatusDocument extends mongoose.Document {
    title: string;
    description: string;
    stateNumber: number;
    cancelled: boolean;
}

const OrderStatusSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    stateNumber: {type: Number, required: true, unique: true},
    cancelled: {type: Boolean, required: true, default: false},
})

const OrderStatusModel = mongoose.model<OrderStatusDocument>("OrderStatus", OrderStatusSchema);

export default OrderStatusModel;