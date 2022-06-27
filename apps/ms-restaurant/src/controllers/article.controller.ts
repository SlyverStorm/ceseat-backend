import { Request, Response } from "express";
import { createArticle, deleteArticle, getAllArticles, getArticle } from "../services/article.service";

export async function createArticleHandler(req: Request, res: Response) {
    const data = req.body;
    const article = await createArticle(data);
    return res.send(article);
}

export async function getArticleHandler(req: Request, res: Response) {
    const articleid = req.params.articleid;
    const article = await getArticle({_id: articleid});
    return res.send(article);
}

export async function getAllArticlesHandler(req: Request, res: Response) {

    //TODO: Add filter querry ???

    const articles = await getAllArticles({});
    return res.send(articles);
}

export async function updateArticleHandler(req: Request, res: Response) {
    const articleid = req.params.articleid;
    const updateData = req.body;

    //TODO: check if user has permission to update this Article

    const article = await getArticle({_id: articleid});
    if (article === null) return res.sendStatus(404);

    const updatedArticle = await getArticle({_id: articleid}, {lean: true});
    return res.send(updatedArticle);
}

export async function deleteArticleHandler(req: Request, res: Response) {
    const articleid = req.params.articleid;

    //TODO: check if user has permission to delete this Article

    const deletion = await deleteArticle({_id: articleid});
    if (deletion === null) return res.sendStatus(404);
    return res.send({
        message: "Article deleted successfully",
        articleid: deletion._id
    })
}