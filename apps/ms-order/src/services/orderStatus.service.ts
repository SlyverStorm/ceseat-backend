import { FilterQuery, QueryOptions,  } from "mongoose";
import OrderStatusModel, { OrderStatusDocument } from "../models/orderStatus.model";

export async function getOrderStatus(
    query: FilterQuery<OrderStatusDocument>,
    options: QueryOptions = {lean: true}
) {
    return OrderStatusModel.findOne({...query}, {}, options);
}

export async function getAllOrderStatus(
    query: FilterQuery<OrderStatusDocument>,
    options: QueryOptions = {lean: true}
) {
    return OrderStatusModel.find({...query}, {}, options);
}
