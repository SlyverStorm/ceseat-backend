import mongoose, { Types } from "mongoose";

export function toObjectId(ids: string) {
    return new Types.ObjectId(ids);
}

export function toObjectIdArray(ids: string[]) {
    return ids.map(id => new Types.ObjectId(id));
}