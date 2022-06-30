import { DocumentDefinition, FilterQuery, now, QueryOptions, UpdateQuery } from "mongoose";
import ArticleModel, { ArticleDocument } from "../models/article.model";

export async function createArticle(input: DocumentDefinition<ArticleDocument>) {
    return (await ArticleModel.create(input)).populate("articleCategory");
}

export async function getArticle(
    query: FilterQuery<ArticleDocument>,
    options: QueryOptions = {lean: true}
) {
    return ArticleModel.findOne({...query, deletedAt: null}, {}, options).populate("articleCategory");
}

export async function getAllArticles(
    query: FilterQuery<ArticleDocument>,
    options: QueryOptions = {lean: true}
) {
    return ArticleModel.find({...query, deletedAt: null}, {}, options).populate("articleCategory");
}

export async function updateArticle(
    query: FilterQuery<ArticleDocument>,
    update: UpdateQuery<ArticleDocument>,
    options: QueryOptions
) {
    return ArticleModel.findOneAndUpdate({...query, deletedAt: null}, update, options).populate("articleCategory");
}

export async function deleteArticle(
    query: FilterQuery<ArticleDocument>
) {
    return ArticleModel.findOneAndUpdate({...query, deletedAt: null}, {deletedAt: new Date(now())});
}