import { Express } from "express";
import validateRessource from "./middleware/validateRessource";
import { upload } from "./middleware/imageUpload";

function routes(app: Express) {

    //app.post("/restaurant", validateRessource())

}

export default routes;