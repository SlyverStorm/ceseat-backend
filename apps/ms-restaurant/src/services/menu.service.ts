import { DocumentDefinition, FilterQuery, now, QueryOptions, UpdateQuery } from "mongoose";
import MenuModel, { MenuDocument } from "../models/menu.model";

export async function createMenu(input: DocumentDefinition<MenuDocument>) {
    return MenuModel.create(input);
}

export async function getMenu(
    query: FilterQuery<MenuDocument>,
    options: QueryOptions = {lean: true}
) {
    return MenuModel.findOne({...query, deletedAt: null}, {}, options);
}

export async function getAllMenus(
    query: FilterQuery<MenuDocument>,
    options: QueryOptions = {lean: true}
) {
    return MenuModel.find({...query, deletedAt: null}, {}, options);
}

export async function updateMenu(
    query: FilterQuery<MenuDocument>,
    update: UpdateQuery<MenuDocument>,
    options: QueryOptions
) {
    return MenuModel.findOneAndUpdate({...query, deletedAt: null}, update, options);
}

export async function deleteMenu(
    query: FilterQuery<MenuDocument>
) {
    return MenuModel.findOneAndUpdate({...query, deletedAt: null}, {deletedAt: new Date(now())});
}