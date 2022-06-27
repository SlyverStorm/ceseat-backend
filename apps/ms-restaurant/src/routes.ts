import { Express, Request, Response } from "express";
import { createArticleHandler, deleteArticleHandler, getAllArticlesHandler, getArticleHandler, updateArticleHandler } from "./controllers/article.controller";
import { createMenuHandler, deleteMenuHandler, getAllMenusHandler, updateMenuHandler } from "./controllers/menu.controller";
import { createRestaurantHandler, deleteRestaurantHandler, getAllRestaurantsHandler, getRestaurantHandler, updateRestaurantHandler } from "./controllers/restaurant.controller";
import validateRessource from "./middleware/validateRessource";
import { createArticleSchema, deleteArticleSchema, getArticleSchema, updateArticleSchema } from "./schemas/article.schema";
import { createMenuSchema, deleteMenuSchema, updateMenuSchema } from "./schemas/menu.schema";
import { createRestaurantSchema, GetRestaurantInput, getRestaurantSchema, updateRestaurantSchema } from "./schemas/restaurant.schema";

function routes(app: Express) {

    // app.post("/restaurants", upload.single("image"), validateRessource(createRestaurantSchema), createRestaurantHandler)
    // app.get("/restaurants/:restaurantId", validateRessource(getRestaurantSchema), getRestaurantHandler)
    // app.get("/restaurants", getAllRestaurantsHandler)
    // app.put("/restaurants/:restaurantId", upload.single("image"), validateRessource(updateRestaurantSchema), updateRestaurantHandler)
    // app.delete("/restaurants/:restaurantId", validateRessource(deleteRestaurantSchema), deleteRestaurantHandler)

    //PRIVATE ROUTES
    //Restaurants
    app.post("/restaurants/me", validateRessource(createRestaurantSchema), createRestaurantHandler) //OK! 
    app.get("/restaurants/me", (req: Request<GetRestaurantInput["params"], {}, {}>, res: Response) => getRestaurantHandler(req, res, true)) //OK!
    app.put("/restaurants/me", validateRessource(updateRestaurantSchema), updateRestaurantHandler) //OK!
    app.delete("/restaurants/me", deleteRestaurantHandler) //OK! // Set restaurant deletedAt to current date
    //Menus
    app.post("/restaurants/me/menus", validateRessource(createMenuSchema), createMenuHandler)
    app.get("/restaurants/me/menus/:menuid", validateRessource(updateMenuSchema), updateMenuHandler)
    app.get("/restaurants/me/menus", getAllArticlesHandler)
    app.put("/restaurants/me/menus/:menuid", validateRessource(updateMenuSchema), updateMenuHandler)
    app.delete("/restaurants/me/menus/:menuid", validateRessource(deleteMenuSchema), deleteMenuHandler)
    //Articles
    app.post("/restaurants/me/articles", validateRessource(createArticleSchema), createArticleHandler)
    app.get("/restaurants/me/articles/:articleid", validateRessource(getArticleSchema), getArticleHandler)
    app.get("/restaurants/me/articles", getAllArticlesHandler)
    app.put("/restaurants/me/articles/:articleid", validateRessource(updateArticleSchema), updateArticleHandler)
    app.delete("/restaurants/me/articles/:articleid", validateRessource(deleteArticleSchema), deleteArticleHandler)

    //PUBLIC ROUTES
    //Restaurants
    app.get("/restaurants/:restaurantid", validateRessource(getRestaurantSchema), (req: Request<GetRestaurantInput["params"], {}, {}>, res: Response) => getRestaurantHandler(req, res, false)); //OK!
    app.get("/restaurants", getAllRestaurantsHandler) // => add query params to filter restaurants
    //Menus
    app.get("/restaurants/:restaurantid/menus/:menuid", validateRessource(updateMenuSchema), updateMenuHandler)
    app.get("/restaurants/:restaurantid/menus", getAllMenusHandler)
    //Articles
    app.get("/restaurants/:restaurantid/articles/:articleid", validateRessource(getArticleSchema), getArticleHandler)
    app.get("/restaurants/:restaurantid/articles", getAllArticlesHandler)
 


}

export default routes;