import { Request, Response } from "express";
import { CreateProductInput, GetProductInput, UpdateProductInput, DeleteProductInput } from "../schemas/product.schema";
import logger from "../utils/logger";
import { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct } from "../services/product.service"

export async function createProductHandler(
    req: Request<{}, {}, CreateProductInput["body"]>, 
    res: Response
) {
    const body = req.body;
    logger.debug(`Creating new product from request...`)
    const product = await createProduct({...body});
    return res.send(product);
}

export async function getProductHandler(
    req: Request<GetProductInput["params"]>,
    res: Response
) {
    const _id = req.params._id;
    logger.debug(`Fetching product from ${_id}...`)
    const product = await getProduct({_id});

    if (!product) return res.sendStatus(404);

    return res.send(product);
}

export async function getAllProductHandler(
    req: Request,
    res: Response
) {
    logger.debug(`Fetching all product from MongoDB database`)
    const products = await getAllProduct();

    if (!products) return res.sendStatus(404);

    return res.send(products);
}

export async function updateProductHandler(
    req: Request<UpdateProductInput["params"]>,
    res: Response
) {
    const _id = req.params._id;
    logger.debug(`Updating product from ${_id}...`)
    const update = req.body;
    const product = await getProduct({_id});

    if (!product) return res.sendStatus(404);

    const updatedProduct = await updateProduct({_id}, update, {new: true});

    return res.send(updatedProduct);
}

export async function deleteProductHandler(
    req: Request<GetProductInput["params"]>,
    res: Response
) {
    const _id = req.params._id;
    logger.debug(`Deleting product from ${_id}...`)
    const product = await getProduct({_id});

    if (!product) return res.sendStatus(404);

    await deleteProduct({_id});
    return res.sendStatus(200);
}