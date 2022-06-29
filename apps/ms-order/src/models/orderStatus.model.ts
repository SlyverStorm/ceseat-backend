import mongoose from "mongoose";

export interface OrderStatusDocument extends mongoose.Document {
    title: string;
    description: string;
}

const OrderStatusSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true}
})

const OrderStatusModel = mongoose.model<OrderStatusDocument>("OrderStatus", OrderStatusSchema);

export default OrderStatusModel;