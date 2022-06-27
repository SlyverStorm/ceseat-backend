import mongoose from "mongoose";
import config from "config";
import logger from "./logger.util";
import ArticleCategoryModel from "../models/articleCategory.model";

function connect(){
    const dbUri = config.get<string>("connect.dbUri");

    return mongoose.connect(dbUri)
    .then (() => {
        logger.info(`Connected to MongoDB Database - ${dbUri}`)

        ArticleCategoryModel.create({
            articleCategoryId: 1,
            name: "Plat"
        }).then(result => logger.info(`Article category successfully created: ${JSON.stringify(result)}`))
        .catch(error => logger.error(`Error creating article category: ${error}`));
        
        ArticleCategoryModel.create({
            articleCategoryId: 2,
            name: "Accompagnement"
        }).then(result => logger.info(`Article category successfully created: ${JSON.stringify(result)}`))
        .catch(error => logger.error(`Error creating article category: ${error}`));
        
        ArticleCategoryModel.create({
            articleCategoryId: 3,
            name: "Dessert"
        }).then(result => logger.info(`Article category successfully created: ${JSON.stringify(result)}`))
        .catch(error => logger.error(`Error creating article category: ${error}`));
        
        ArticleCategoryModel.create({
            articleCategoryId: 4,
            name: "Boisson"
        }).then(result => logger.info(`Article category successfully created: ${JSON.stringify(result)}`))
        .catch(error => logger.error(`Error creating article category: ${error}`));
        
    }).catch((error) => {
        logger.fatal(`Unable to connect MongoDB Database - ${dbUri}`);
        process.exit(1);
    })
}

export default connect