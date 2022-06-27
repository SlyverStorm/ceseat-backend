import { Request, Response } from "express";
import path from "node:path";
import { CreateRestaurantInput, DeleteRestaurantInput, GetRestaurantInput, UpdateRestaurantInput } from "../schemas/restaurant.schema";
import { createRestaurant, deleteRestaurant, getAllRestaurants, getRestaurant, updateRestaurant } from "../services/restaurant.service";
import { deleteImage, getImage, updateImage } from "../utils/images.util";
import logger from "../utils/logger.util";

export async function createRestaurantHandler(
    req: Request<{}, {}, CreateRestaurantInput["body"]>, 
    res: Response
) {
    const body = req.body;
    let filepath
    if (req.file) {
        filepath = req.file.filename
    } else {
        filepath = null;
    }

    logger.debug(`Creating new restaurant from request...`);
    try {
        const restaurant = await createRestaurant({...body, image: filepath, userId: "user_radsazsaw"}); // a changer
        return res.send(restaurant);
    }
    catch(e: any){
        if(req.file) deleteImage(req.file.filename);
        if (e.status) return res.status(e.status).send(e);
        return res.sendStatus(500);
    }
}

export async function getRestaurantHandler(
    req: Request<GetRestaurantInput["params"]>,
    res: Response
) {
    const restaurantId = req.params.restaurantId;
    logger.debug(`Fetching restaurant from ${restaurantId}...`)
    
    const restaurant = await getRestaurant({restaurantId});
    if (!restaurant) return res.sendStatus(404);
    return res.send(restaurant);
}

export async function getAllRestaurantsHandler(
    req: Request,
    res: Response
) {
    logger.debug(`Fetching all restaurants from MongoDB database`)
    const restaurants = await getAllRestaurants();

    if (!restaurants) return res.sendStatus(404);

    return res.send(restaurants);
}

export async function updateRestaurantHandler(
    req: Request<UpdateRestaurantInput["params"]>,
    res: Response
) {
    const restaurantId = req.params.restaurantId;
    logger.debug(`Updating restaurant from ${restaurantId}...`)
    const update = req.body;
    try {
        const restaurant = await getRestaurant({restaurantId});
        if (!restaurant) return res.sendStatus(404);
        if (req.file && restaurant.image == null) update.image = req.file.filename // Handle when user created an account without an image

        const updatedRestaurant = await updateRestaurant({restaurantId}, update, {new: true});
        if(req.file && restaurant.image != null && updatedRestaurant?.image != null) updateImage(req.file, updatedRestaurant.image); // Handle image replace when updating a user with another image
        return res.send(updatedRestaurant);
    }
    catch (e: any) {
        if(req.file) deleteImage(req.file.filename);
        if (e.status) return res.status(e.status).send(e);
        return res.sendStatus(500);
    }
    
    
}

export async function deleteRestaurantHandler(
    req: Request<DeleteRestaurantInput["params"]>,
    res: Response
) {
    const restaurantId = req.params.restaurantId;
    logger.debug(`Deleting restaurant from ${restaurantId}...`)
    const restaurant = await getRestaurant({restaurantId});

    if (!restaurant) return res.sendStatus(404);

    const deletion = await deleteRestaurant({restaurantId});
    if (deletion != null && restaurant && restaurant.image != null) deleteImage(restaurant.image)
    return res.send({
        message: "Restaurant was deleted with success",
        deletedId: restaurant.restaurantId
    });
}

export async function getRestaurantImageHandler(
    req: Request,
    res: Response
) {
    const imgId = req.params.img;
    logger.debug(`Getting image from ${imgId}...`)

    const imagepath = await getImage(imgId);
    if (imagepath != null) res.sendFile(path.join(__dirname, "../../",imagepath));
    else res.sendFile(path.join(__dirname, "../../images/default.png"));
}