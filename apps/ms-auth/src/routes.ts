import { Express, Request, Response } from "express";
import { createUserHandler, deleteUserHandler, getAllUsersHandler, getUserHandler, getUserImageHandler, updateUserHandler } from "./controllers/user.controller";
import validateRessource from "./middleware/validateRessource";
import { createUserSchema, deleteUserSchema, GetUserInput, getUserSchema, updateUserSchema } from "./schemas/user.schema";
import { upload } from "./middleware/imageUpload";
import { createSessionSchema } from "./schemas/session.schema";
import { createSessionHandler, deleteSessionHandler, getSessionsHandler } from "./controllers/session.controller";
import requireUser from "./middleware/requireUser";

function routes(app: Express) {

    //Commercial service related user requests
    app.get("/users/:userid", requireUser("commercial"), validateRessource(getUserSchema), (req: Request<GetUserInput["params"]>, res) => getUserHandler(req, res, true, false));
    app.get("/users", requireUser("commercial"), getAllUsersHandler);                                                                       //OK!
    //app.put("/users/:userid", requireUser("commercial"), upload.single("image"), validateRessource(updateUserSchema), updateUserHandler);
    // app.delete("/users/:userid", requireUser("commercial"), validateRessource(deleteUserSchema), deleteUserHandler);

    // //User register request
    app.post("/users/register/customer", upload.single("image"), validateRessource(createUserSchema), (req, res) => createUserHandler(req, res, 1));    //OK!
    app.post("/users/register/driver", upload.single("image"), validateRessource(createUserSchema), (req, res) => createUserHandler(req, res, 2));      //OK!
    app.post("/users/register/restaurant", upload.single("image"), validateRessource(createUserSchema), (req, res) => createUserHandler(req, res, 3));  //OK!
    // //Basic user request (self information)
    app.get("/users/me", requireUser("all"), validateRessource(getUserSchema), (req: Request<GetUserInput["params"]>, res) => getUserHandler(req, res));
    // app.put("/users/me", requireUser("all"), upload.single("image"), validateRessource(updateUserSchema), updateUserHandler);
    // app.delete("/users/me", requireUser("all"), validateRessource(deleteUserSchema), deleteUserHandler);

    // //User Image CDN
    // app.get("/users/images/:img", getUserImageHandler)

    // //User log in sessions requests
    // app.post("/sessions", validateRessource(createSessionSchema), createSessionHandler);
    // //app.get("/sessions/me", requireUser("all"), getSessionsHandler);
    // app.delete("/sessions", requireUser("all"), deleteSessionHandler);

    // //Sessions logs from user accessible from technical users
    // app.get("/sessions", requireUser("technical"), WIPHandle);

    // //Sessions verifiers requests
    // app.get("/sessions/verify", requireUser("all"), OK)                      //OK!
    // app.get("/sessions/verify/customer", requireUser("customer"), OK)        //OK!
    // app.get("/sessions/verify/restaurant", requireUser("restaurant"), OK)    //OK!
    // app.get("/sessions/verify/driver", requireUser("driver"), OK)            //OK!
    // app.get("/sessions/verify/commercial", requireUser("commercial"), OK)    //OK!
    // app.get("/sessions/verify/technical", requireUser("technical"), OK)      //OK!

    // //Users Addresses related self requests
    // app.post("/users/adresses/me", requireUser("customer"), WIPHandle)
    // app.get("/users/adresses/me", requireUser("customer"), WIPHandle)
    // app.get("/users/adresses/me/:addressid", requireUser("customer"), WIPHandle)
    // app.put("/users/adresses/me/:addressid", requireUser("customer"), WIPHandle)
    // app.delete("/users/adresses/me/:addressid", requireUser("customer"), WIPHandle)

    // //Users Wallets related self requests (only self)
    // app.post("/users/wallets/me", requireUser("customer"), WIPHandle)
    // app.get("/users/wallets/me", requireUser("customer"), WIPHandle)
    // //app.get("/users/wallets/me/:walletid", requireUser("customer"), WIPHandle) -> not useful
    // //app.put("/users/wallets/me/:walletid", requireUser("customer"), WIPHandle) -> not useful
    // app.delete("/users/wallets/me/:walletid", requireUser("customer"), WIPHandle)

}

async function WIPHandle(req: Request, res: Response) {
    res.send("Route currently in Work in progress")
}

function OK(req: Request, res: Response) {
    res.sendStatus(200)
}

export default routes;