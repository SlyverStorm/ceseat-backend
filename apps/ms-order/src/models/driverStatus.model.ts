import mongoose, { Types } from "mongoose";

export enum StatusType {
    FREE = "Free",
    DELIVERING = "Delivering",
    OFFLINE = "Offline"
}

export interface DriverStatusDocument extends mongoose.Document {
    status: string; 
    driverId: string;
    position: {
        latitude: number;
        longitude: number;
    };
    deletedAt?: Date | null;
}

const DriverStatusSchema = new mongoose.Schema({
    status: {type: String, required: true},
    driverId: {type: String, required: true},
    position: {
        type: Object,
        required: true,
        properties: {
            latitude: {type: Number, required: true},
            longitude: {type: Number, required: true}
        }
    },
    deletedAt: {type: Date, required: false, default: null}, 
},{
    timestamps: true
});

const DriverStatusModel = mongoose.model<DriverStatusDocument>("DriverStatus", DriverStatusSchema);

export default DriverStatusModel;
