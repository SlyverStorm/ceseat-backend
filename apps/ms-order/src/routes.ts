import { Express, Request, Response } from "express";
import requireUser from "./middleware/requireUser";

function routes(app: Express) {

    //Private routes :
    // app.post("/orders/me", requireUser("customer"), createOrderHandler)

}

export default routes;