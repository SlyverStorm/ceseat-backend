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
        dbUri: process.env.DATABASE_URL // ex : "mongodb://db:27017"
    },

    //Images upload variables
    images: {
        destination: "images/",
        maxSize: 1024 * 1024 * 8
    },
    

    //Logger variables
    logger: {
        logLevel: "debug"
    }
    
}