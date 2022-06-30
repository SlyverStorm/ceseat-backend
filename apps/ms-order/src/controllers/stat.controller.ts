import { Request, Response } from "express";
import { getAllOrders } from "../services/order.service";
import { getOrderStatus } from "../services/orderStatus.service";
import { getAllRestaurants, getUserRestaurant } from "../services/restaurant.service";

export async function getRestaurantOrdersStats(req: Request<{}, {}, {}>, res: Response) {

    const restaurant = await getUserRestaurant(req);
    if (restaurant === null) return res.status(404).send("Restaurant not found for this user");
    console.log(restaurant);

    const completedStatus = await getOrderStatus({stateNumber: 7});
    if (completedStatus === null) return res.status(500).send("Order status not found");
    
    const completedOrders = await getAllOrders({ $match: {"restaurant._id": restaurant._id}, orderStatus: completedStatus._id});
    const refusedOrders = await getAllOrders({ $match: {"restaurant._id": restaurant._id}, orderStatus: {$ne: completedStatus._id}});
    //return res.status(200).send(orders);

    return res.status(200).send({
        nbArticles: restaurant.articles.length,
        nbMenus: restaurant.menus.length,
        nbCompletedOrders: completedOrders.length,
        nbRefusedOrders: refusedOrders.length
    })
}

export async function getGlobalOrdersStats(req: Request<{}, {}, {}>, res: Response) {

    const restaurants = await getAllRestaurants(req);
    if (restaurants === null) return res.status(404).send("Restaurants not found");
    console.log(restaurants);

    const completedStatus = await getOrderStatus({stateNumber: 7});
    if (completedStatus === null) return res.status(500).send("Order status not found");
    
    const completedOrders = await getAllOrders({ orderStatus: completedStatus._id});
    const refusedOrders = await getAllOrders({ orderStatus: {$ne: completedStatus._id}});

    return res.status(200).send({
        nbRestaurants: restaurants.length,
        nbCompletedOrders: completedOrders.length,
        nbRefusedOrders: refusedOrders.length,
        turnOver: completedOrders.reduce((acc, order) => acc + order.price, 0)
    })
}