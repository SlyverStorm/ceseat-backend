import { Request, Response } from "express";
import { StatusType } from "../models/driverStatus.model";
import { GetDriverStatusOptionalInput, GetDriverStatusMandatoryInput } from "../schemas/driverStatus.schema";
import { CreateOrderInput, GetOrderInput } from "../schemas/order.schema";
import { createDriverStatus, getDriverStatus, updateDriverStatus } from "../services/driverStatus.service";
import { createOrder, getAllOrders, getOrder, updateOrder } from "../services/order.service";
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
            articles: data.summary.articles.map((article) => ({...restaurant.articles.find((v:any) => v._id = article._id), quantity: article.quantity})),
            menus: data.summary.menus.map((menu) => ({...restaurant.menus.find((v:any) => v._id = menu._id), quantity: menu.quantity})),
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
    formatedData.price = (formatedData.summary.menus.reduce((sum, add) => sum + add.price * add.quantity, 0) +  formatedData.summary.articles.reduce((sum, add) => sum + add.price * add.quantity, 0)).toFixed(2);

    //console.log(JSON.stringify(formatedData));

    let order = await createOrder({...formatedData, driver: null});
    return res.status(200).send(order);
}

export async function getOrdersClientHandler(req: Request<{}, {}, {}>, res: Response) {
    const userid = res.locals.user.id;
    const completed = req.query.completed;
    if (completed && completed === "true") {
        const completedStatus = await getOrderStatus({stateNumber: 7});
        if (completedStatus === null) return res.status(500).send("Order status not found");
        const orders = await getAllOrders({userId: userid, orderStatus: completedStatus._id});
        return res.status(200).send(orders);
    }
    else if (completed && completed === "false") {
        const completedStatus = await getOrderStatus({stateNumber: 7});
        if (completedStatus === null) return res.status(500).send("Order status not found");
        const orders = await getAllOrders({userId: userid, orderStatus: {$ne: completedStatus._id}});
        return res.status(200).send(orders);
    }

    const orders = await getAllOrders({userId: userid});
    return res.status(200).send(orders);
}

export async function getOrdersRestaurantHandler(req: Request<{}, {}, {}>, res: Response) {
    const userid = res.locals.user.id;

    const restaurant = await getUserRestaurant(req);
    if (restaurant === null) return res.status(404).send("Restaurant not found for this user");
    console.log(restaurant);

    const completed = req.query.completed;
    if (completed === "true") {
        const completedStatus = await getOrderStatus({stateNumber: 7});
        if (completedStatus === null) return res.status(500).send("Order status not found");
        const orders = await getAllOrders({$match: {"restaurant._id": restaurant._id}, orderStatus: completedStatus._id});
        return res.status(200).send(orders);
    }
    else if (completed && completed === "false") {
        const completedStatus = await getOrderStatus({stateNumber: 7});
        if (completedStatus === null) return res.status(500).send("Order status not found");
        const orders = await getAllOrders({$match: {"restaurant._id": restaurant._id}, orderStatus: {$ne: completedStatus._id}});
        return res.status(200).send(orders);
    }
    
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

    const completed = req.query.completed;
    if (completed === "true") {
        const completedStatus = await getOrderStatus({stateNumber: 7});
        if (completedStatus === null) return res.status(500).send("Order status not found");
        const orders = await getAllOrders({driver: driver._id, orderStatus: completedStatus._id});
        return res.status(200).send(orders);
    }
    else if (completed && completed === "false") {
        const completedStatus = await getOrderStatus({stateNumber: 7});
        if (completedStatus === null) return res.status(500).send("Order status not found");
        const orders = await getAllOrders({driver: driver._id, orderStatus: {$ne: completedStatus._id}});
        return res.status(200).send(orders);
    }
    
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
    orders = orders.filter((order: any) => order.orderStatus.stateNumber === 2);
    console.log(orders);
    orders = orders.filter(order => (order.restaurant.address.latitude <= parseFloat(lat.toString()) + rad && order.restaurant.address.latitude >= parseFloat(lat.toString()) - rad) && (order.restaurant.address.longitude <= parseFloat(lng.toString()) + rad && order.restaurant.address.longitude >= parseFloat(lng.toString()) - rad))
    return res.status(200).send(orders);
}

export async function setDriverNextState(req: Request<GetOrderInput["params"], {}, {}>, res: Response) {
    const userid = res.locals.user.id;
    const orderid = req.params.orderid;

    let driver = await getDriverStatus({userId: userid});
    if (driver === null) return res.status(404).send("Driver status not found");

    const order: any = await getOrder({_id: orderid});
    if (order === null) return res.status(404).send("Order not found");

    if (order.orderStatus.stateNumber === 2 && order.driver === null ) {
        const newOrderStatus = await getOrderStatus({stateNumber: 3});
        if (newOrderStatus === null) return res.status(500).send("Order status not found");
        const updatedOrder = await updateOrder({_id: orderid}, {driver: driver._id, orderStatus: newOrderStatus._id}, {new: true});
        return res.status(200).send(updatedOrder);
    }

    if (order.orderStatus.stateNumber === 5 && order.driver === driver._id) {
        const newOrderStatus = await getOrderStatus({stateNumber: 6});
        if (newOrderStatus === null) return res.status(500).send("Order status not found");
        const updatedOrder = await updateOrder({_id: orderid}, {orderStatus: newOrderStatus._id}, {new: true});
        return res.status(200).send(updatedOrder);
    }

    if (order.orderStatus.stateNumber === 6 && order.driver === driver._id) {
        const newOrderStatus = await getOrderStatus({stateNumber: 7});
        if (newOrderStatus === null) return res.status(500).send("Order status not found");
        const updatedOrder = await updateOrder({_id: orderid}, {orderStatus: newOrderStatus._id}, {new: true});
        return res.status(200).send(updatedOrder);
    }

    return res.status(400).send("Cannot set next step for this order");	
    //const order = await getOrder({_id: orderid, $match: {"driver._id": driver._id}});
}

export async function setRestaurantNextState(req: Request<GetOrderInput["params"], {}, {}>, res: Response) {
    const userid = res.locals.user.id;
    const orderid = req.params.orderid;

    const restaurant = await getRestaurant(req, userid);
    if (restaurant === null) return res.status(404).send("Restaurant not found");

    const order: any = await getOrder({_id: orderid, $match: {'restaurant._id': restaurant._id}});
    if (order === null) return res.status(404).send("Order not found");
    console.log(order)

    if (order.orderStatus.stateNumber === 1 && order.driver === null ) {
        const newOrderStatus = await getOrderStatus({stateNumber: 2});
        if (newOrderStatus === null) return res.status(500).send("Order status not found");
        const updatedOrder = await updateOrder({_id: orderid}, {orderStatus: newOrderStatus._id}, {new: true});
        return res.status(200).send(updatedOrder);
    }

    if (order.orderStatus.stateNumber === 3) {
        const newOrderStatus = await getOrderStatus({stateNumber: 4});
        if (newOrderStatus === null) return res.status(500).send("Order status not found");
        const updatedOrder = await updateOrder({_id: orderid}, {orderStatus: newOrderStatus._id}, {new: true});
        return res.status(200).send(updatedOrder);
    }

    if (order.orderStatus.stateNumber === 4) {
        const newOrderStatus = await getOrderStatus({stateNumber: 5});
        if (newOrderStatus === null) return res.status(500).send("Order status not found");
        const updatedOrder = await updateOrder({_id: orderid}, {orderStatus: newOrderStatus._id}, {new: true});
        return res.status(200).send(updatedOrder);
    }

    return res.status(400).send("Cannot set next step for this order");
    //const order = await getOrder({_id: orderid, $match: {"driver._id": driver._id}});
}

export async function cancelOrder(req: Request<GetOrderInput["params"], {}, {}>, res: Response) {
    const userid = res.locals.user.id;
    const orderid = req.params.orderid;

    const restaurant = await getRestaurant(req, userid);
    if (restaurant === null) return res.status(404).send("Restaurant not found");

    const order: any = await getOrder({_id: orderid, $match: {'restaurant._id': restaurant._id}});
    if (order === null) return res.status(404).send("Order not found");

    if (order.orderStatus.stateNumber === 1) {
        const newOrderStatus = await getOrderStatus({stateNumber: -1});
        if (newOrderStatus === null) return res.status(500).send("Order status not found");
        const updatedOrder = await updateOrder({_id: orderid}, {orderStatus: newOrderStatus._id}, {new: true});
        return res.status(200).send(updatedOrder);
    }

    return res.status(400).send("Cannot cancel this order");
}