import mongoose from "mongoose";
import config from "config";
import logger from "./logger.util";
import OrderStatusModel from "../models/orderStatus.model";

function connect(){
    const dbUri = config.get<string>("connect.dbUri");

    return mongoose.connect(dbUri)
    .then (() => {
        logger.info(`Connected to MongoDB Database - ${dbUri}`)

        // ArticleCategoryModel.create({
        //     articleCategoryId: 1,
        //     name: "Plat"
        // }).then(result => logger.info(`Article category successfully created: ${JSON.stringify(result)}`))
        // .catch(error => logger.warn(`Category "Plat" already exists`));
        
        // ArticleCategoryModel.create({
        //     articleCategoryId: 2,
        //     name: "Accompagnement"
        // }).then(result => logger.info(`Article category successfully created: ${JSON.stringify(result)}`))
        // .catch(error => logger.warn(`Category "Accompagnement" already exists`));
        
        // ArticleCategoryModel.create({
        //     articleCategoryId: 3,
        //     name: "Dessert"
        // }).then(result => logger.info(`Article category successfully created: ${JSON.stringify(result)}`))
        // .catch(error => logger.warn(`Category "Dessert" already exists`));
        
        // ArticleCategoryModel.create({
        //     articleCategoryId: 4,
        //     name: "Boisson"
        // }).then(result => logger.info(`Article category successfully created: ${JSON.stringify(result)}`))
        // .catch(error => logger.warn(`Category "Boisson" already exists`));


        // Normal Status :
        OrderStatusModel.create({
            orderStatusId: 1,
            title: "En attente validation commande",
            description: "L'utilisateur a créé la commande et est en attente de validation par le restaurant",
            cancelled: false
        }).then(result => logger.info(`Order status "En attente validation commande" successfully created: ${JSON.stringify(result)}`))
        .catch(() => logger.warn(`Order status "En attente validation commande" already exists`));

        OrderStatusModel.create({
            orderStatusId: 2,
            title: "En attente livreur",
            description: "La commande est validée par le restaurant et est en attente d'un livreur disponible",
            cancelled: false
        }).then(result => logger.info(`Order status "En attente livreur" successfully created: ${JSON.stringify(result)}`))
        .catch(() => logger.warn(`Order status "En attente livreur" already exists`));

        OrderStatusModel.create({
            orderStatusId: 3,
            title: "En attente préparation commande",
            description: "La commande est prise en charge par un livreur et est en attente de préparation",
            cancelled: false
        }).then(result => logger.info(`Order status "En attente préparation commande" successfully created: ${JSON.stringify(result)}`))
        .catch(() => logger.warn(`Order status "En attente préparation commande" already exists`));

        OrderStatusModel.create({
            orderStatusId: 4,
            title: "En cours de préparation",
            description: "La commande est en cours de préparation",
            cancelled: false
        }).then(result => logger.info(`Order status "En cours de préparation" successfully created: ${JSON.stringify(result)}`))
        .catch(() => logger.warn(`Order status "En cours de préparation" already exists`));

        OrderStatusModel.create({
            orderStatusId: 5,
            title: "Commande prête",
            description: "La commande est prête et en attente de livraison",
            cancelled: false
        }).then(result => logger.info(`Order status "Commande prête" successfully created: ${JSON.stringify(result)}`))
        .catch(() => logger.warn(`Order status "Commande prête" already exists`));

        OrderStatusModel.create({
            orderStatusId: 6,
            title: "En cours de livraison",
            description: "La commande est en cours de livraison",
            cancelled: false
        }).then(result => logger.info(`Order status "En cours de livraison" successfully created: ${JSON.stringify(result)}`))
        .catch(() => logger.warn(`Order status "En cours de livraison" already exists`));

        OrderStatusModel.create({
            orderStatusId: 7,
            title: "Commande livrée",
            description: "La commande à bien été livrée au client",
            cancelled: false
        }).then(result => logger.info(`Order status "Commande livrée" successfully created: ${JSON.stringify(result)}`))
        .catch(() => logger.warn(`Order status "Commande livrée" already exists`));

        // Cancel status :
        OrderStatusModel.create({
            orderStatusId: -1,
            title: "Annulée par le client",
            description: "Le client a annulé la commande",
            cancelled: true
        }).then(result => logger.info(`Order status "Annulée par le client" successfully created: ${JSON.stringify(result)}`))
        .catch(() => logger.warn(`Order status "Annulée par le client" already exists`));

        OrderStatusModel.create({
            orderStatusId: -2,
            title: "Réfusée",
            description: "Le restaurant a refusé la commande",
            cancelled: true
        }).then(result => logger.info(`Order status "Refusée" successfully created: ${JSON.stringify(result)}`))
        .catch(() => logger.warn(`Order status "Refusée" already exists`));

        OrderStatusModel.create({
            orderStatusId: -3,
            title: "Aucun livreur trouvé",
            description: "Aucun livreur n'a été trouvé pour la livraison de la commande",
            cancelled: true
        }).then(result => logger.info(`Order status "Aucun livreur trouvé" successfully created: ${JSON.stringify(result)}`))
        .catch(() => logger.warn(`Order status "Aucun livreur trouvé" already exists`));

        // OrderStatusModel.create({
        //     orderStatusId: -4,
        //     title: "Annulée par le restaurant",
        //     description: "Le restaurant a annulé la commande",
        //     cancelled: true
        // }).then(result => logger.info(`Order status "Annulée par le restaurant" successfully created: ${JSON.stringify(result)}`))
        // .catch(() => logger.warn(`Order status "Annulée par le restaurant" already exists`));


        
    }).catch((error) => {
        logger.fatal(`Unable to connect MongoDB Database - ${dbUri}`);
        process.exit(1);
    })
}

export default connect