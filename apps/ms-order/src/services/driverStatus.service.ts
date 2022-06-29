import { DocumentDefinition, FilterQuery, now, QueryOptions, UpdateQuery } from "mongoose";
import DriverStatusModel, { DriverStatusDocument } from "../models/driverStatus.model";

export async function createDriverStatus(input: DocumentDefinition<DriverStatusDocument>) {
    return DriverStatusModel.create(input);
}

export async function getDriverStatus(
    query: FilterQuery<DriverStatusDocument>,
    options: QueryOptions = {lean: true}
) {
    return DriverStatusModel.findOne({...query, deletedAt: null}, {}, options)
}

export async function getAllDriverStatus(
    query: FilterQuery<DriverStatusDocument>,
    options: QueryOptions = {lean: true}
) {
    return DriverStatusModel.find({...query, deletedAt: null}, {}, options)
}

export async function updateDriverStatus(
    query: FilterQuery<DriverStatusDocument>,
    update: UpdateQuery<DriverStatusDocument>,
    options: QueryOptions
) {
    return DriverStatusModel.findOneAndUpdate({...query, deletedAt: null}, update, options)
}

export async function deleteDriverStatus(
    query: FilterQuery<DriverStatusDocument>
) {
    return DriverStatusModel.findOneAndUpdate({...query, deletedAt: null}, {deletedAt: new Date(now())});
}