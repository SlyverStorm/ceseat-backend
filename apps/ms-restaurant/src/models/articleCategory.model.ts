import mongoose from "mongoose";
import logger from "../utils/logger.util";

export interface ArticleCategoryDocument extends mongoose.Document {
    articleCategoryId: number;
    name: string;
}

const ArticleCategorySchema = new mongoose.Schema({
    articleCategoryId: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
},{
    timestamps:true
});

const ArticleCategoryModel = mongoose.model<ArticleCategoryDocument>("ArticleCategory", ArticleCategorySchema);

export default ArticleCategoryModel;