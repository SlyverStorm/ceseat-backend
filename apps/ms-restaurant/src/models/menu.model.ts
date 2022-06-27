import mongoose from "mongoose";
import { Types } from "mongoose";

export interface MenuDocument extends mongoose.Document {
    name: string;
    image: string | null;
    description: string;
    price: number;
    isAvailable: boolean;
    content: {
        sectionName: string;
        articles: [Types.ObjectId];
    },
    deletedAt: Date | null;
}

const MenuSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image : {type: String, required: false, default: null},
    description: {type: String, required: false, default: ""},
    price: {type: Number, required: true},
    isAvailable: {type: Boolean, required: false, default: false},
    content: [{
        type: Object,
        required: true,
        properties: {
            sectionName: {type: String, required: true},
            articles: [{type: Types.ObjectId, ref: "Article"}]
        }
    }],
    restaurantId: {type: Types.ObjectId, ref: "Restaurant", required: true},
    deletedAt: {type: Date, required: false, default: null}
},{
    timestamps: true
});

const MenuModel = mongoose.model<MenuDocument>("Menu", MenuSchema);

export default MenuModel;