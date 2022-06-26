import { Express, Request, Response } from "express";
import { createUserHandler, deleteUserHandler, getAllUsersHandler, getUserHandler, getUserImageHandler, updateUserHandler } from "./controllers/user.controller";
import validateRessource from "./middleware/validateRessource";
import { createUserSchema, deleteUserSchema, GetUserInput, getUserSchema, UpdateUserInput, updateUserSchema } from "./schemas/user.schema";
import { upload } from "./middleware/imageUpload";
import { createSessionSchema } from "./schemas/session.schema";
import { createSessionHandler, deleteSessionHandler, getAllSessionsHandler, getSessionsHandler } from "./controllers/session.controller";
import requireUser from "./middleware/requireUser";
import { createWalletHandler, deleteWalletHandler, getAllWalletsHandler, getWalletHandler, updateWalletHandler } from "./controllers/wallet.controller";
import { createWalletSchema, deleteWalletSchema, getWalletSchema, updateWalletSchema } from "./schemas/wallet.schema";

function routes(app: Express) {

     // //User Image CDN
     app.get("/users/images/:img", getUserImageHandler) //OK!

    // //Basic user request (self information)
    app.get("/users/me", requireUser("all"), (req: Request<GetUserInput["params"]>, res) => getUserHandler(req, res));                                  //OK!
    app.put("/users/me", requireUser("all"), upload.single("image"), (req: Request<UpdateUserInput["params"]>, res) => updateUserHandler(req, res));    //OK!
    app.delete("/users/me", requireUser("all"), (req: Request<GetUserInput["params"]>, res) => deleteUserHandler(req, res));                            //OK!

    //Commercial service related user requests
    app.get("/users/:userid", requireUser("commercial"), validateRessource(getUserSchema), (req: Request<GetUserInput["params"]>, res) => getUserHandler(req, res, true, false));                                   //OK!
    app.get("/users", requireUser("commercial"), getAllUsersHandler);                                                                                                                                               //OK!
    app.put("/users/:userid", requireUser("commercial"), upload.single("image"), validateRessource(updateUserSchema), (req: Request<UpdateUserInput["params"]>, res) => updateUserHandler(req, res, true, false));  //OK!
    app.delete("/users/:userid", requireUser("commercial"), validateRessource(deleteUserSchema), (req: Request<GetUserInput["params"]>, res) => deleteUserHandler(req, res, false));                                //OK!

    // //User register request
    app.post("/users/register/customer", upload.single("image"), validateRessource(createUserSchema), (req, res) => createUserHandler(req, res, 1));    //OK!
    app.post("/users/register/driver", upload.single("image"), validateRessource(createUserSchema), (req, res) => createUserHandler(req, res, 2));      //OK!
    app.post("/users/register/restaurant", upload.single("image"), validateRessource(createUserSchema), (req, res) => createUserHandler(req, res, 3));  //OK!

    // //User log in sessions requests
    app.post("/sessions", validateRessource(createSessionSchema), createSessionHandler);    //OK!
    app.get("/sessions/me", requireUser("all"), getSessionsHandler);                        //OK!
    app.delete("/sessions/me", requireUser("all"), deleteSessionHandler);                   //OK!

    // //Sessions logs from user accessible from technical users
    app.get("/sessions", requireUser("technical"), getAllSessionsHandler);   //OK!

    // //Sessions verifiers requests
    app.get("/sessions/verify", requireUser("all"), OK)                      //OK!
    app.get("/sessions/verify/customer", requireUser("customer"), OK)        //OK!
    app.get("/sessions/verify/restaurant", requireUser("restaurant"), OK)    //OK!
    app.get("/sessions/verify/driver", requireUser("driver"), OK)            //OK!
    app.get("/sessions/verify/commercial", requireUser("commercial"), OK)    //OK!
    app.get("/sessions/verify/technical", requireUser("technical"), OK)      //OK!

    // //Users Addresses related self requests
    // app.post("/users/adresses/me", requireUser("customer"), WIPHandle)
    // app.get("/users/adresses/me", requireUser("customer"), WIPHandle)
    // app.get("/users/adresses/me/:addressid", requireUser("customer"), WIPHandle)
    // app.put("/users/adresses/me/:addressid", requireUser("customer"), WIPHandle)
    // app.delete("/users/adresses/me/:addressid", requireUser("customer"), WIPHandle)

    // //Users Wallets related self requests (only self)
    app.post("/users/wallets/me", requireUser("customer"), validateRessource(createWalletSchema), createWalletHandler)
    app.get("/users/wallets/me", requireUser("customer"), getAllWalletsHandler)
    app.get("/users/wallets/me/:walletid", requireUser("customer"), validateRessource(getWalletSchema), getWalletHandler) //-> not useful
    app.put("/users/wallets/me/:walletid", requireUser("customer"), validateRessource(updateWalletSchema), updateWalletHandler) //-> not useful
    app.delete("/users/wallets/me/:walletid", requireUser("customer"), validateRessource(deleteWalletSchema), deleteWalletHandler)
}

async function WIPHandle(req: Request, res: Response) {
    res.send("Route currently in Work in progress")
}

function OK(req: Request, res: Response) {
    res.sendStatus(200)
}

export default routes;