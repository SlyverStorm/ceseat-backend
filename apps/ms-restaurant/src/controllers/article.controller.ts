import { Request, Response } from "express";
import { Types } from "mongoose";
import { CreateArticleInput, DeleteArticleInput, GetArticleInput, UpdateArticleInput } from "../schemas/article.schema";
import { GetRestaurantInput } from "../schemas/restaurant.schema";
import { createArticle, deleteArticle, getAllArticles, getArticle, updateArticle } from "../services/article.service";
import { getRestaurant, updateRestaurant } from "../services/restaurant.service";
import logger from "../utils/logger.util";

export async function createArticleHandler(req: Request<{}, {}, CreateArticleInput["body"]>, res: Response) {

    const userid = res.locals.user.id;
    //const userid = "user_adminadmin";

    const restaurant = await getRestaurant({userId: userid});
    if (restaurant === null) return res.sendStatus(403);

    const data = req.body;
    const article = await createArticle({...data, restaurantId: restaurant._id});
    if (restaurant.articles) {
        await updateRestaurant({_id: restaurant._id}, {$push: {articles: article._id}}, {new: true});
    }
    else {
        await updateRestaurant({_id: restaurant._id}, {articles: [article._id]}, {new: true});
    } 
    return res.send(article);
}

export async function getArticleHandler(req: Request<GetArticleInput["params"], {}, {}>, res: Response) {
    const articleid = req.params.articleid;
    const article = await getArticle({_id: articleid});
    if (article === null) return res.sendStatus(404);
    return res.send(article);
}

export async function getAllArticlesHandler(req: Request<GetRestaurantInput["params"], {}, {}>, res: Response, self: boolean = false) {

    //TODO: Add filter querry ???
    const restaurantid = req.params.restaurantid;
    let getAllQuery;
    if (self) {
        const userid = res.locals.user.id;
        //const userid = "user_adminadmin";
        const restaurant = await getRestaurant({userId: userid}, {});
        if (restaurant === null) return res.sendStatus(403);

        

        getAllQuery = {restaurantId: restaurant._id};
        logger.info(JSON.stringify(getAllQuery))
    }
    else getAllQuery = { restaurantId: restaurantid };

    const articles = await getAllArticles({...getAllQuery});
    if (articles === null) return res.sendStatus(404);
    return res.send(articles);
}

export async function updateArticleHandler(req: Request<UpdateArticleInput["params"], {}, UpdateArticleInput["body"]>, res: Response) {
    const articleid = req.params.articleid;
    const updateData = req.body;
    const userid = res.locals.user.id;
    //const userid = "user_adminadmin";

    const restaurant = await getRestaurant({userId: userid},{});
    //logger.debug(restaurant!.articles!.indexOf(new Types.ObjectId(articleid)));
    if (restaurant === null) {
        return res.sendStatus(403);
    }
    else if (!restaurant.articles || (restaurant.articles && restaurant.articles.indexOf(new Types.ObjectId(articleid)) === -1)) {
        return res.sendStatus(403);
    }

    //TODO: check if user has permission to update this Article

    const article = await getArticle({_id: articleid});
    if (article === null) return res.sendStatus(404);

    const updatedArticle = await updateArticle({_id: articleid}, updateData, {new: true});
    return res.send(updatedArticle);
}

export async function deleteArticleHandler(req: Request<DeleteArticleInput["params"], {}, {}>, res: Response) {

    const articleid = req.params.articleid;
    const userid = res.locals.user.id;
    //const userid = "user_adminadmin";

    const restaurant = await getRestaurant({userId: userid},{});
    //logger.debug(restaurant!.articles!.indexOf(new Types.ObjectId(articleid)));
    if (restaurant === null) {
        return res.sendStatus(403);
    }
    else if (!restaurant.articles || (restaurant.articles && restaurant.articles.indexOf(new Types.ObjectId(articleid)) === -1)) {
        return res.sendStatus(403);
    }

    const deletion = await deleteArticle({_id: articleid});
    if (deletion === null) return res.sendStatus(404);
    return res.send({
        message: "Article deleted successfully",
        articleid: deletion._id
    })
}