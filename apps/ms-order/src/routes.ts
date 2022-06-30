import { Express, Request, Response } from "express";
import { createOrderHandler } from "./controllers/order.controller";
import requireUser from "./middleware/requireUser";
import validateRessource from "./middleware/validateRessource";
import { createOrderSchema } from "./schemas/order.schema";

function routes(app: Express) {

    //Private routes :
    app.post("/orders/me", requireUser("customer"), validateRessource(createOrderSchema), createOrderHandler)

}

export default routes;