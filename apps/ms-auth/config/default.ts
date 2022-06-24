/*--------------------------------------------------------------------

    Config variables used by the app
    The file define all variables and their default values

    Configuration could be override using environnement configuration 
    json files, changing "NODE_ENV" value in ".env" will used config
    related to that value
    Example : NODE_END="DEV" will try to use DEV.json, if it doen't
    exist it will use default values

---------------------------------------------------------------------*/

import { version } from "../package.json";
import process from "process";

// Default configuration object model
export default {

    //App context variables
    context: {
        appName: "ceseat-ms-template",
        version: version
    },
    

    //Connexion variables
    connect: {
        port: 3000,
    //     dbUri: process.env.DATABASE_URL // ex : "mongodb://db:27017" // NOT USEFUL IN OUR CASE BESAUSE OF PRISMA WITH MYSQL CONNEXION
    }, 

    //Images upload variables
    images: {
        destination: "images/",
        maxSize: 1024 * 1024 * 8
    },
    

    //Logger variables
    logger: {
        logLevel: "debug"
    },

    jwt: {
        accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
        accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
        refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
        refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
        accessTokenTtl: "1h",
        refreshTokenTtl: "1w",
    },
    
}