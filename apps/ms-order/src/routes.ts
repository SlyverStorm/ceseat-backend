import { Express, Request, Response } from "express";
import { createOrderHandler, getAllOrdersHandler, getOrdersClientHandler, getOrdersDriverHandler, getOrdersRestaurantHandler, searchForOrders } from "./controllers/order.controller";
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
    // app.put("/orders/restaurants/me", requireUser("restaurant"))
    // app.put("/orders/drivers/me", requireUser("driver"))

    //Health check route :
    app.get("/healthcheck", (req: Request, res: Response) => {
        res.sendStatus(200);
    })

}

export default routes;