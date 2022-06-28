import { DocumentDefinition, FilterQuery, now, QueryOptions, UpdateQuery } from "mongoose";
import RestaurantModel, { RestaurantDocument } from "../models/restaurant.model";

export async function createRestaurant(input: DocumentDefinition<RestaurantDocument>) {
    return RestaurantModel.create(input);
}

export async function getRestaurant(
    query: FilterQuery<RestaurantDocument>,
    options: QueryOptions = {lean: true},
    self: boolean = false
) {
    const getQuery = self ? {...query} : {...query, deletedAt: null};
    return RestaurantModel.findOne({...getQuery}, {}, options)
    .populate([{
        path: "articles",
        populate: {
            path: "articleCategory",
        }
    },
    {
        path: "menus",
        populate: {
            path: "content",
            populate: {
                path: "articles",
                model: "Article",
                populate: {
                    path: "articleCategory"
                }
            }
        }
    }]);
}

export async function getAllRestaurants(
    query: FilterQuery<RestaurantDocument>,
    options: QueryOptions = {lean: true}
) {
    return RestaurantModel.find({...query, deletedAt: null}, {}, options)
    .populate([{
        path: "articles",
        populate: {
            path: "articleCategory",
        }
    },
    {
        path: "menus",
        populate: {
            path: "content",
            populate: {
                path: "articles",
                model: "Article",
                populate: {
                    path: "articleCategory"
                }
            }
        }
    }]);
}

export async function updateRestaurant(
    query: FilterQuery<RestaurantDocument>,
    update: UpdateQuery<RestaurantDocument>,
    options: QueryOptions,
    self: boolean = false
) {
    const updateQuery = self ? {...query} : {...query, deletedAt: null};
    return RestaurantModel.findOneAndUpdate({...updateQuery}, update, options)
    .populate([{
        path: "articles",
        populate: {
            path: "articleCategory",
        }
    },
    {
        path: "menus",
        populate: {
            path: "content",
            populate: {
                path: "articles",
                model: "Article",
                populate: {
                    path: "articleCategory"
                }
            }
        }
    }]);
}

export async function deleteRestaurant(
    query: FilterQuery<RestaurantDocument>
) {
    return RestaurantModel.findOneAndUpdate({...query, deletedAt: null}, {deletedAt: new Date(now())});
}