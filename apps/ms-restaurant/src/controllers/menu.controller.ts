import { Request, Response } from "express";
import { Types } from "mongoose";
import { CreateMenuInput, DeleteMenuInput, GetMenuInput, UpdateMenuInput } from "../schemas/menu.schema";
import { GetRestaurantInput } from "../schemas/restaurant.schema";
import { createMenu, deleteMenu, getAllMenus, getMenu, updateMenu } from "../services/menu.service";
import { getRestaurant, updateRestaurant } from "../services/restaurant.service";
import logger from "../utils/logger.util";

export async function createMenuHandler(req: Request<{}, {}, CreateMenuInput["body"]>, res: Response) {

    const userid = res.locals.user.id;
    //const userid = "user_adminadmin";

    const restaurant = await getRestaurant({userId: userid});
    if (restaurant === null) return res.sendStatus(403);

    const data = req.body;
    const formatedData = {
        name: data.name,
        price: data.price,
        description: data.description,
        isAvailable: data.isAvailable,
        content: <Array<{sectionName: string, articles: Types.ObjectId[]}>>[],
        restaurantId: restaurant._id
    }
    data.content?.forEach(item => {
        const sectionName = item.sectionName;
        let menuArticles: Types.ObjectId[] = [];
        item.articles?.forEach(article => {
            menuArticles.push(new Types.ObjectId(article));
        });
        formatedData.content.push({sectionName: sectionName, articles: menuArticles});
    })
    //formatedData.content?.map(item => item.articles?.map(articleid => articleid = new Types.ObjectId(articleid)));

    const menu = await createMenu({...formatedData});
    if (restaurant.menus) {
        await updateRestaurant({_id: restaurant._id}, {$push: {menus: menu._id}}, {new: true});
    }
    else {
        await updateRestaurant({_id: restaurant._id}, {Menus: [menu._id]}, {new: true});
    } 
    return res.send(menu);
}

export async function getMenuHandler(req: Request<GetMenuInput["params"], {}, {}>, res: Response) {
    const menuid = req.params.menuid;
    const menu = await getMenu({_id: menuid});
    if (menu === null) return res.sendStatus(404);
    return res.send(menu);
}

export async function getAllMenusHandler(req: Request<GetRestaurantInput["params"], {}, {}>, res: Response, self: boolean = false) {

    //TODO: Add filter querry ???
    const restaurantid = req.params.restaurantid;
    let getAllQuery;
    if (self) {
        const userid = res.locals.user.id;
        //const userid = "user_adminadmin";
        const restaurant = await getRestaurant({userId: userid}, {});
        if (restaurant === null) return res.sendStatus(403);

        

        getAllQuery = {restaurantId: restaurant._id};
        logger.info(JSON.stringify(getAllQuery))
    }
    else getAllQuery = { restaurantId: restaurantid };

    const menus = await getAllMenus({...getAllQuery});
    if (menus === null) return res.sendStatus(404);
    return res.send(menus);
}

export async function updateMenuHandler(req: Request<UpdateMenuInput["params"], {}, UpdateMenuInput["body"]>, res: Response) {
    const menuid = req.params.menuid;
    const updateData = req.body;
    const userid = res.locals.user.id;
    //const userid = "user_adminadmin";

    const restaurant = await getRestaurant({userId: userid},{}, false);
    //logger.debug(restaurant!.Menus!.indexOf(new Types.ObjectId(Menuid)));
    if (restaurant === null) {
        return res.status(403).send("Forbidden: restaurant not found");
    }
    else if (!restaurant.menus || (restaurant.menus && restaurant.menus.indexOf(new Types.ObjectId(menuid)) === -1)) {
        return res.status(403).send("Forbidden: menu not found in restaurant");
    }

    //TODO: check if user has permission to update this Menu

    const menu = await getMenu({_id: menuid});
    if (menu === null) return res.sendStatus(404);

    const updatedMenu = await updateMenu({_id: menuid}, updateData, {new: true});
    return res.send(updatedMenu);
}

export async function deleteMenuHandler(req: Request<DeleteMenuInput["params"], {}, {}>, res: Response) {

    const menuid = req.params.menuid;
    const userid = res.locals.user.id;
    //const userid = "user_adminadmin";

    const restaurant = await getRestaurant({userId: userid},{}, false);
    //logger.debug(restaurant!.Menus!.indexOf(new Types.ObjectId(Menuid)));
    if (restaurant === null) {
        return res.status(403).send("Forbidden: restaurant not found");
    }
    else if (!restaurant.menus || (restaurant.menus && restaurant.menus.indexOf(new Types.ObjectId(menuid)) === -1)) {
        return res.status(403).send("Forbidden: menu not found in restaurant");
    }

    const deletion = await deleteMenu({_id: menuid});
    if (deletion === null) return res.sendStatus(404);
    return res.send({
        message: "Menu deleted successfully",
        Menuid: deletion._id
    })
}