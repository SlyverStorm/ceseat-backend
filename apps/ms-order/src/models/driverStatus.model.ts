import mongoose, { Types } from "mongoose";

export enum StatusType {
    FREE = "Free",
    DELIVERING = "Delivering",
    OFFLINE = "Offline"
}

export interface DriverStatusDocument extends mongoose.Document {
    status: StatusType; 
    driverId: string;
    position: {
        label: string;
        latitude: number;
        longitude: number;
    };
    deletedAt?: Date | null;
}

const DriverStatusSchema = new mongoose.Schema({
    status: {type: StatusType, required: true},
    driverId: {type: String, required: true},
    position: {
        type: Object,
        required: true,
        properties: {
            label: {type: String, required: true},
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
