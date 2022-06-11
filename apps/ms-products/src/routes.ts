import { Express, Request, Response } from "express";
import { createProductHandler, getProductHandler, updateProductHandler, deleteProductHandler, getAllProductHandler } from "./controllers/product.controller";
import validateRessource from "./middleware/validateRessource";
import { createProductSchema, getProductSchema, updateProductSchema, deleteProductSchema } from "./schemas/product.schema";

function routes(app: Express) {

    app.post("/products", validateRessource(createProductSchema), createProductHandler)

    /**
   * @openapi
   * '/products/{_id}':
   *  get:
   *     tags:
   *     - Products
   *     summary: Get a single product by the _id
   *     parameters:
   *      - name: _id
   *        in: path
   *        description: The id of the product
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Product'
   *       404:
   *         description: Product not found
   */
    app.get("/products/:_id", validateRessource(getProductSchema), getProductHandler)
    app.get("/products", getAllProductHandler)
    app.put("/products/:_id", validateRessource(updateProductSchema), updateProductHandler)
    app.delete("/products/:_id", validateRessource(deleteProductSchema), deleteProductHandler)

}

export default routes;