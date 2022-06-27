import { Request, Response } from "express";
import ArticleModel from "../models/article.model";
import ArticleCategoryModel from "../models/articleCategory.model";
import RestaurantModel from "../models/restaurant.model";
import logger from "../utils/logger.util";

export async function testFunctionHandler(req: Request, res: Response) {

    const array = [1, 3, 4, 2, 3, 4, 7, 8.5, 15, 3];
    const result = array.reduce((acc, curr) => acc + curr) / array.length
    logger.debug(result.toString());
    return res.send("OK!");

    // logger.debug("testFunctionHandler start !");

    // const cat = await ArticleCategoryModel.findOne({articleCatId: 2, name: "Plat"});
    // if (cat === null) return res.send("dessert category doesn't exists");

    // logger.debug("testFunctionHandler cat found !");

    // const restaurant = await RestaurantModel.create({
    //     name: "Restaurant 1",
    //     description: "Restaurant 1 description",
    //     address: {
    //         label: "Restaurant 1 address",
    //         longitude: 1,
    //         latitude: 1
    //     },
    //     userId: "userId"
    // });

    // logger.debug("testFunctionHandler restaurant created !");
    
    // const article = await ArticleModel.create({
    //     name: "Test Article",
    //     description: "This is a test article",
    //     price: 10,
    //     restaurantId: restaurant._id,
    //     articleCatId: cat._id
    // })

    // logger.debug("testFunctionHandler article created !");

    // //logger.debug(JSON.stringify(await article.populate("restaurantId")));
    // await article.populate("restaurantId")
    // return res.send(article);


}