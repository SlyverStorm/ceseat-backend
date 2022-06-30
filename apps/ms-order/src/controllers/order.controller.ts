import { Request, Response } from "express";
import { CreateOrderInput } from "../schemas/order.schema";
import { createOrder } from "../services/order.service";
import { getOrderStatus } from "../services/orderStatus.service";
import { toObjectId, toObjectIdArray } from "../utils/mongoose.utils";



export async function createOrderHandler(req: Request<{}, {}, CreateOrderInput["body"]>, res: Response) {

    const userid = res.locals.user.id;

    const data = req.body;

    const defaultOrderStatus = await getOrderStatus({stateNumber: 1});
    if (defaultOrderStatus === null) {
        return res.status(500).send("Default order status not found");
    }

    const formatedData = {
        ...data,
        summary: {
            articles: toObjectIdArray(data.summary.articles),
            menus: toObjectIdArray(data.summary.menus),
        },
        restaurant: toObjectId(data.restaurant),
        driver: toObjectId(data.driver),
        userId: userid,
        orderStatus: defaultOrderStatus._id,
    }

    let order = await createOrder({...formatedData});

    // const restaurant = await getRestaurant({userId: userid});
    // if (restaurant === null) return res.sendStatus(403);

    // const data = req.body;
    // const article = await createArticle({...data, restaurantId: restaurant._id});
    // if (restaurant.articles) {
    //     await updateRestaurant({_id: restaurant._id}, {$push: {articles: article._id}}, {new: true});
    // }
    // else {
    //     await updateRestaurant({_id: restaurant._id}, {articles: [article._id]}, {new: true});
    // } 
    // return res.send(article);
}