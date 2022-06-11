import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface ProductDocument extends mongoose.Document {
    title: string;
    description: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new mongoose.Schema({
    _id: {
        type: String, 
        required: true,
        unique: true,
        default: () => `product_${nanoid()}`,
    },
    title: {type: String, required: true},
    description: {type: String, required: true},
    img:
    {
        data: Buffer,
        contentType: String
    },
    price: {type: Number, required: true}
},{
    timestamps:true
});

const ProductModel = mongoose.model<ProductDocument>("Product", productSchema);

export default ProductModel;