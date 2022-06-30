import { DocumentDefinition, FilterQuery, now, QueryOptions, UpdateQuery } from "mongoose";
import OrderModel, { OrderDocument } from "../models/order.model";
import ArticleModel from "../models/article.model";
import RestaurantModel from "../models/restaurant.model";
import MenuModel from "../models/menu.model";
import ArticleCategoryModel from "../models/articleCategory.model";

export async function createOrder(input: DocumentDefinition<OrderDocument>) {
    return (await OrderModel.create(input)).populate([{
        path: "summary.articles",
        match: {deletedAt: null},
        populate: {
            path: "articleCategory",
        }
    },
    {
        path: "summary.menus",
        match: {deletedAt: null},
        populate: {
            path: "content",
            populate: {
                path: "articles",
                model: "Article",
                match: {deletedAt: null},
                populate: {
                    path: "articleCategory"
                }
            }
        }
    }]);
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