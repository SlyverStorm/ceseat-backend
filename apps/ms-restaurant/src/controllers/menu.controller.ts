import { Request, Response } from "express";
import { createMenu, deleteMenu, getAllMenus, getMenu } from "../services/menu.service";

export async function createMenuHandler(req: Request, res: Response) {
    const data = req.body;
    const menu = await createMenu(data);
    return res.send(menu);
}

export async function getMenuHandler(req: Request, res: Response) {
    const menuid = req.params.menuid;
    const menu = await getMenu({_id: menuid});
    return res.send(menu);
}

export async function getAllMenusHandler(req: Request, res: Response) {

    //TODO: Add filter querry ???

    const menus = await getAllMenus({});
    return res.send(menus);
}

export async function updateMenuHandler(req: Request, res: Response) {
    const menuid = req.params.menuid;
    const updateData = req.body;

    //TODO: check if user has permission to update this Menu

    const menu = await getMenu({_id: menuid});
    if (menu === null) return res.sendStatus(404);

    const updatedMenu = await getMenu({_id: menuid}, {lean: true});
    return res.send(updatedMenu);
}

export async function deleteMenuHandler(req: Request, res: Response) {
    const menuid = req.params.menuid;

    //TODO: check if user has permission to delete this Menu

    const deletion = await deleteMenu({_id: menuid});
    if (deletion === null) return res.sendStatus(404);
    return res.send({
        message: "Menu deleted successfully",
        menuid: deletion._id
    })
}