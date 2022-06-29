import { Request, Response } from "express";
import { getAllArticlesCategories } from "../services/articleCategory.service";

export async function getArticlesCategoriesHandler(req: Request, res: Response) {
    const categories = await getAllArticlesCategories({});
    return res.send(categories);
}