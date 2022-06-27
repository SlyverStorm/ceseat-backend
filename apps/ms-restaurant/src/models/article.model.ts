import mongoose from "mongoose";
import { Types } from "mongoose";

export interface ArticleDocument extends mongoose.Document {
    name: string;
    image?: string | null;
    description?: string;
    price: number;
    isAvailable?: boolean;
    restaurantId: Types.ObjectId;
    articleCatId: Types.ObjectId;
    deletedAt?: Date | null;
}

const ArticleSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image : {type: String, required: false, default: null},
    description: {type: String, required: false, default: ""},
    price: {type: Number, required: true},
    isAvailable: {type: Boolean, required: false, default: false},
    restaurantId: {type: Types.ObjectId, ref: "Restaurant", required: true},
    articleCatId: {type: Types.ObjectId, ref: "ArticleCategory", required: true},
    deletedAt: {type: Date, required: false, default: null}
},{
    timestamps:true
});

const ArticleModel = mongoose.model<ArticleDocument>("Article", ArticleSchema);

export default ArticleModel;