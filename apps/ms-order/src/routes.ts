import { Express, Request, Response } from "express";
import { cancelOrder, createOrderHandler, getAllOrdersHandler, getOrdersClientHandler, getOrdersDriverHandler, getOrdersRestaurantHandler, searchForOrders, setDriverNextState, setRestaurantNextState } from "./controllers/order.controller";
import requireUser from "./middleware/requireUser";
import validateRessource from "./middleware/validateRessource";
import { createOrderSchema } from "./schemas/order.schema";

function routes(app: Express) {

    //Create order
    app.post("/orders/me", requireUser("customer"), validateRessource(createOrderSchema), createOrderHandler)

    //Get order
    app.get("/orders/me", requireUser("customer"), getOrdersClientHandler)
    app.get("/orders/restaurants/me", requireUser("restaurant"), getOrdersRestaurantHandler)
    app.get("/orders/drivers/me", requireUser("driver"), getOrdersDriverHandler)
    app.get("/orders/drivers/search", requireUser("driver"), searchForOrders)
    app.get("/orders", requireUser("commercial"), getAllOrdersHandler)

    //Modify order
    app.get("/orders/restaurants/next/:orderid", requireUser("restaurant"), setRestaurantNextState)
    app.get("/orders/drivers/next/:orderid", requireUser("driver"), setDriverNextState)

    //Cancelled order
    app.delete("/orders/restaurants/cancel/:orderid", requireUser("restaurant"), cancelOrder)
    // app.delete("/orders/drivers/cancel/:orderid", requireUser("driver"))

    //Health check route :
    app.get("/healthcheck", (req: Request, res: Response) => {
        res.sendStatus(200);
    })

}

export default routes;