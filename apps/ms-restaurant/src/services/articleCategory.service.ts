import { FilterQuery, QueryOptions } from "mongoose";
import ArticleCategoryModel, { ArticleCategoryDocument } from "../models/articleCategory.model";

export async function getAllArticlesCategories(
    query: FilterQuery<ArticleCategoryDocument>,
    options: QueryOptions = {lean: true}
) {
    return ArticleCategoryModel.find({...query}, {}, options);
}