import mongoose from "mongoose";
import logger from "../utils/logger.util";

const ArticleCategorySchema = new mongoose.Schema({
    articleCategoryId: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
},{
    timestamps:true
});

const ArticleCategoryModel = mongoose.model("ArticleCategory", ArticleCategorySchema);

export default ArticleCategoryModel;