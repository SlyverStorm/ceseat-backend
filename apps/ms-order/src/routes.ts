import { Express, Request, Response } from "express";
import { createOrderHandler } from "./controllers/order.controller";
import requireUser from "./middleware/requireUser";
import validateRessource from "./middleware/validateRessource";
import { createOrderSchema } from "./schemas/order.schema";

function routes(app: Express) {

    //Private routes :
    app.post("/orders/me", requireUser("customer"), validateRessource(createOrderSchema), createOrderHandler)

    //Health check route :
    app.get("/healthcheck", (req: Request, res: Response) => {
        res.sendStatus(200);
    })

}

export default routes;