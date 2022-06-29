import { DocumentDefinition, FilterQuery, now, QueryOptions, UpdateQuery } from "mongoose";
import OrderModel, { OrderDocument } from "../models/order.model";

export async function createOrder(input: DocumentDefinition<OrderDocument>) {
    return OrderModel.create(input);
}

export async function getOrder(
    query: FilterQuery<OrderDocument>,
    options: QueryOptions = {lean: true}
) {
    return OrderModel.findOne({...query, deletedAt: null}, {}, options).populate("orderStatus");
}

export async function getAllOrders(
    query: FilterQuery<OrderDocument>,
    options: QueryOptions = {lean: true}
) {
    return OrderModel.find({...query, deletedAt: null}, {}, options).populate("orderStatus");
}

export async function updateOrder(
    query: FilterQuery<OrderDocument>,
    update: UpdateQuery<OrderDocument>,
    options: QueryOptions
) {
    return OrderModel.findOneAndUpdate({...query, deletedAt: null}, update, options).populate("orderStatus");
}

export async function deleteOrder(
    query: FilterQuery<OrderDocument>
) {
    return OrderModel.findOneAndUpdate({...query, deletedAt: null}, {deletedAt: new Date(now())});
}