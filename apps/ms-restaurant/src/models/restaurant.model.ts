import mongoose, { Types } from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface RestaurantDocument extends mongoose.Document {
    restaurantId?: string;
    name: string;
    address: string;
    description?: string;
    image?: string | null;
    userId: string;
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