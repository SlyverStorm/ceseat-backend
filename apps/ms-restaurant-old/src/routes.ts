import { Express } from "express";
import validateRessource from "./middleware/validateRessource";
import { upload } from "./middleware/imageUpload";
import { createRestaurantSchema, deleteRestaurantSchema, getRestaurantSchema, updateRestaurantSchema } from "./schemas/restaurant.schema";
import { createRestaurantHandler, deleteRestaurantHandler, getAllRestaurantsHandler, getRestaurantHandler, updateRestaurantHandler } from "./controllers/restaurant.controller";

function routes(app: Express) {

    app.post("/restaurants", upload.single("image"), validateRessource(createRestaurantSchema), createRestaurantHandler)
    app.get("/restaurants/:restaurantId", validateRessource(getRestaurantSchema), getRestaurantHandler)
    app.get("/restaurants", getAllRestaurantsHandler)
    app.put("/restaurants/:restaurantId", upload.single("image"), validateRessource(updateRestaurantSchema), updateRestaurantHandler)
    app.delete("/restaurants/:restaurantId", validateRessource(deleteRestaurantSchema), deleteRestaurantHandler)

}

export default routes;