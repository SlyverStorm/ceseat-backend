import { Request, Response } from "express";
import { StatusType } from "../models/driverStatus.model";
import { GetDriverStatusOptionalInput, GetDriverStatusMandatoryInput } from "../schemas/driverStatus.schema";
import { CreateOrderInput } from "../schemas/order.schema";
import { createDriverStatus, getDriverStatus, updateDriverStatus } from "../services/driverStatus.service";
import { createOrder, getAllOrders } from "../services/order.service";
import { getOrderStatus } from "../services/orderStatus.service";
import { getRestaurant, getUserRestaurant } from "../services/restaurant.service";
import { toObjectId, toObjectIdArray } from "../utils/mongoose.utils";

export async function createOrderHandler(req: Request<{}, {}, CreateOrderInput["body"]>, res: Response) {

    const userid = res.locals.user.id;
    const data = req.body;

    const defaultOrderStatus = await getOrderStatus({stateNumber: 1});
    if (defaultOrderStatus === null) {
        return res.status(500).send("Default order status not found");
    }

    const restaurant = await getRestaurant(req, data.restaurant);
    if (restaurant === null) return res.status(404).send("Restaurant in order not found");

    const formatedData = {
        ...data,
        summary: {
            articles: data.summary.articles.map((article) => restaurant.articles.find((v:any) => v._id = article)),
            menus: data.summary.menus.map((menu) => restaurant.menus.find((v:any) => v._id = menu)),
        },
        restaurant: {
            _id: toObjectId(restaurant._id),
            name: restaurant.name,
            address: restaurant.address,
        },
        userId: userid,
        orderStatus: defaultOrderStatus._id,
        price: 0,
    }
    if (!(formatedData.summary.articles.length > 0 || formatedData.summary.menus.length > 0)) return res.status(400).send("Order must contain at least one article or menu");
    formatedData.price = (formatedData.summary.menus.reduce((sum, add) => sum + add.price, 0) +  formatedData.summary.articles.reduce((sum, add) => sum + add.price, 0)).toFixed(2);

    //console.log(JSON.stringify(formatedData));

    let order = await createOrder({...formatedData, driver: null});
    return res.status(200).send(order);
}

export async function getOrdersClientHandler(req: Request<{}, {}, {}>, res: Response) {
    const userid = res.locals.user.id;
    const orders = await getAllOrders({userId: userid});
    return res.status(200).send(orders);
}

export async function getOrdersRestaurantHandler(req: Request<{}, {}, {}>, res: Response) {
    const userid = res.locals.user.id;

    const restaurant = await getUserRestaurant(req);
    if (restaurant === null) return res.status(404).send("Restaurant not found for this user");
    console.log(restaurant);
    
    const orders = await getAllOrders({ $match: {"restaurant._id": restaurant._id}});
    return res.status(200).send(orders);
}

export async function getOrdersDriverHandler(req: Request<{}, GetDriverStatusOptionalInput["query"], {}>, res: Response) {
    const userid = res.locals.user.id;
    const lat = req.query.lat;
    const lng = req.query.lng;

    let driver = await getDriverStatus({userId: userid});
    if (driver === null) {
        if (lat === undefined || lng === undefined) return res.status(400).send("Driver Status not found, lat and lng query are not defined cannot initialize driver status");
        driver = await createDriverStatus({status: StatusType.FREE, driverId: userid, position: {latitude: parseFloat(lat.toString()), longitude: parseFloat(lng.toString())}});
    }
    if (lat != undefined && lng != undefined) {
        driver = await updateDriverStatus({_id: driver._id}, {position: {latitude: parseFloat(lat.toString()), longitude: parseFloat(lng.toString())}}, {new: true});
        if (driver === null) return res.status(500).send("Driver status not updated");
    }
    console.log(driver);
    
    const orders = await getAllOrders({driver: driver._id});
    return res.status(200).send(orders);
}

export async function getAllOrdersHandler(req: Request<{}, {}, {}>, res: Response) {
    const orders = await getAllOrders({});
    return res.status(200).send(orders);
}

export async function searchForOrders(req: Request<{}, GetDriverStatusMandatoryInput["query"], {}>, res: Response) {
    const userid = res.locals.user.id;
    const lat = req.query.lat;
    const lng = req.query.lng;
    if (lat === undefined || lng === undefined) return res.status(400).send("lat, lng and rad query are not defined");
    const rad = 0.25;

    let driver = await getDriverStatus({userId: userid});
    if (driver === null) {
        if (lat === undefined || lng === undefined) return res.status(400).send("Driver Status not found, lat and lng query are not defined cannot initialize driver status");
        driver = await createDriverStatus({status: StatusType.FREE, driverId: userid, position: {latitude: parseFloat(lat.toString()), longitude: parseFloat(lng.toString())}});
    }
    if (lat != undefined && lng != undefined) {
        driver = await updateDriverStatus({_id: driver._id}, {position: {latitude: parseFloat(lat.toString()), longitude: parseFloat(lng.toString())}}, {new: true});
        if (driver === null) return res.status(500).send("Driver status not updated");
    }
    console.log(driver);

    let orders = await getAllOrders({driver: null});
    if (orders === null) return res.status(404).send("No orders found");
    console.log(orders);
    orders = orders.filter(order => (order.restaurant.address.latitude <= parseFloat(lat.toString()) + rad && order.restaurant.address.latitude >= parseFloat(lat.toString()) - rad) && (order.restaurant.address.longitude <= parseFloat(lng.toString()) + rad && order.restaurant.address.longitude >= parseFloat(lng.toString()) - rad))
    return res.status(200).send(orders);
}
