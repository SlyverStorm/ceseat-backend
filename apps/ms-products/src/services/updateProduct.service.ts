import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ProductModel, { ProductDocument } from "../models/product.model";

export async function updateProduct(
    query: FilterQuery<ProductDocument>,
    update: UpdateQuery<ProductDocument>,
    options: QueryOptions
) {
    return ProductModel.findOneAndUpdate(query, update, options);
}