import mongoose from "mongoose";
import { Types } from "mongoose";

export interface RestaurantDocument extends mongoose.Document {
    name: string;
    image?: string | null;
    description?: string;
    address: {
        label: string;
        longitude: number;
        latitude: number;
    }
    articles?: [Types.ObjectId];
    menus?: [Types.ObjectId];
    userId: string;
    deletedAt?: Date | null;
}

const RestaurantSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: false, default: null},
    description: {type: String, required: false, default: ""},
    address: {
        type: Object,
        required: true,
        properties: {
            label: {type: String, required: true},
            longitude: {type: Number, required: true},
            latitude: {type: Number, required: true},
        }
    },

    articles: [{type: Types.ObjectId, ref: "Article"}],
    menus: [{type: Types.ObjectId, ref: "Menu"}],

    userId: {type: String, required: true, unique: true},
    deletedAt: {type: Date, required: false, default: null},
},{
    timestamps: true
});

const RestaurantModel = mongoose.model<RestaurantDocument>("Restaurant", RestaurantSchema);

export default RestaurantModel;