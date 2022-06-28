import { Express, Request, Response } from "express";
import { createArticleHandler, deleteArticleHandler, getAllArticlesHandler, getArticleHandler, updateArticleHandler } from "./controllers/article.controller";
import { getArticlesCategoriesHandler } from "./controllers/articleCategory.controller";
import { createMenuHandler, deleteMenuHandler, getAllMenusHandler, updateMenuHandler } from "./controllers/menu.controller";
import { createRestaurantHandler, deleteRestaurantHandler, getAllRestaurantsHandler, getRestaurantHandler, updateRestaurantHandler } from "./controllers/restaurant.controller";
import requireUser from "./middleware/requireUser";
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
    app.post("/restaurants/me", requireUser, validateRessource(createRestaurantSchema), createRestaurantHandler) //OK! 
    app.get("/restaurants/me", requireUser, (req: Request<GetRestaurantInput["params"], {}, {}>, res: Response) => getRestaurantHandler(req, res, true)) //OK!
    app.put("/restaurants/me", requireUser, validateRessource(updateRestaurantSchema), updateRestaurantHandler) //OK!
    app.delete("/restaurants/me", requireUser, deleteRestaurantHandler) //OK! // Set restaurant deletedAt to current date
    //Menus
    app.post("/restaurants/me/menus", requireUser, validateRessource(createMenuSchema), createMenuHandler)
    app.get("/restaurants/me/menus", requireUser, (req: Request<GetRestaurantInput["params"], {}, {}>, res: Response) => getAllMenusHandler(req, res, true))
    app.put("/restaurants/me/menus/:menuid", requireUser, validateRessource(updateMenuSchema), updateMenuHandler)
    app.delete("/restaurants/me/menus/:menuid", requireUser, validateRessource(deleteMenuSchema), deleteMenuHandler)
    //Articles
    app.post("/restaurants/me/articles", requireUser, validateRessource(createArticleSchema), createArticleHandler) //OK!
    app.get("/restaurants/me/articles", requireUser, (req: Request<GetRestaurantInput["params"], {}, {}>, res: Response) => getAllArticlesHandler(req, res, true)) //OK!
    app.put("/restaurants/me/articles/:articleid", requireUser, validateRessource(updateArticleSchema), updateArticleHandler) //OK!
    app.delete("/restaurants/me/articles/:articleid", requireUser, validateRessource(deleteArticleSchema), deleteArticleHandler) //OK!

    //PUBLIC ROUTES
    //Restaurants
    app.get("/restaurants/:restaurantid", validateRessource(getRestaurantSchema), (req: Request<GetRestaurantInput["params"], {}, {}>, res: Response) => getRestaurantHandler(req, res, false)); //OK!
    app.get("/restaurants", getAllRestaurantsHandler) //OK! // => add query params to filter restaurants
    //Menus
    app.get("/restaurants/menus/:menuid", validateRessource(updateMenuSchema), updateMenuHandler)
    app.get("/restaurants/:restaurantid/menus", (req: Request<GetRestaurantInput["params"], {}, {}>, res) => getAllMenusHandler(req, res, false))
    //Articles Categories
    app.get("/restaurants/articles/categories", getArticlesCategoriesHandler) //OK!
    //Articles
    app.get("/restaurants/articles/:articleid", validateRessource(getArticleSchema), getArticleHandler) //OK!
    app.get("/restaurants/:restaurantid/articles", (req: Request<GetRestaurantInput["params"], {}, {}>, res) => getAllArticlesHandler(req, res, false)) //OK!
    
 


}

export default routes;