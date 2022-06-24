import { Express } from "express";
import { createUserHandler, deleteUserHandler, getAllUsersHandler, getUserHandler, getUserImageHandler, updateUserHandler } from "./controllers/user.controller";
import validateRessource from "./middleware/validateRessource";
import { createUserSchema, deleteUserSchema, getUserSchema, updateUserSchema } from "./schemas/user.schema";
import { upload } from "./middleware/imageUpload";
import { createSessionSchema } from "./schemas/session.schema";
import { createSessionHandler, deleteSessionHandler, getSessionsHandler } from "./controllers/session.controller";
import requireUser from "./middleware/requireUser";
import logger from "./utils/logger.util"

function routes(app: Express) {

    app.post("/users", upload.single("image"), validateRessource(createUserSchema), createUserHandler);

    /**
   * @openapi
   * '/products/{_id}':
   *  get:
   *     tags:
   *     - Products
   *     summary: Get a single product by the _id
   *     parameters:
   *      - name: _id
   *        in: path
   *        description: The id of the product
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Product'
   *       404:
   *         description: Product not found
   */
    app.get("/users/:_id", validateRessource(getUserSchema), getUserHandler);
    app.get("/users", getAllUsersHandler);
    app.put("/users/:_id", upload.single("image"), validateRessource(updateUserSchema), updateUserHandler);
    app.delete("/users/:_id", validateRessource(deleteUserSchema), deleteUserHandler);
    app.get("/users/images/:img", getUserImageHandler)

    app.post("/sessions", validateRessource(createSessionSchema), createSessionHandler);
    app.get("/sessions", requireUser("all"), getSessionsHandler);
    app.delete("/sessions", requireUser("all"), deleteSessionHandler);

    app.get("/sessions/verify", requireUser("all"), (req, res) => {
        res.sendStatus(200)
    })

}

export default routes;