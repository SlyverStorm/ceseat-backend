import mongoose, { Types } from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface ArticleDocument extends mongoose.Document {
    articleId?: string;

    name: string;
    image: string | null;
    description: string;
    price: number;
    isAvailable: boolean;

    restaurantId: 

    deletedAt?: string | null
}

const restaurantSchema = new mongoose.Schema({
    restaurantId: {
        type: String, 
        required: true,
        unique: true,
        default: () => `restaurant_${nanoid()}`,
    },
    name: {type: String, required: true},
    address: {type: String, required: true},
    description: {type: String, required: false},
    image: {type: String, required: false},
    userId: {type: String, required: false},
    deletedAt: {type: String, required: false, default:  null}
},{
    timestamps:true
});

const RestaurantModel = mongoose.model<RestaurantDocument>("Restaurant", restaurantSchema);

export default RestaurantModel;