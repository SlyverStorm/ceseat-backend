import express from "express";
import 'dotenv/config';
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger"
import routes from "./routes";
import swaggerDocs from "./utils/swagger";
import cors from "cors";

//Displaying context data (app name and version) from configuration :
const appName = config.get<number>("context.appName");
const appVersion = config.get<number>("context.version");
logger.info(`Starting ${appName} V${appVersion} ...`);

//Creating express app
const app = express();
//Using express json parser to handle request body handling
app.use(express.json());
//app.use(express.);
app.use(cors({
    origin: '*'
}));

//Importing listen port from configuration
const port = config.get<number>("connect.port");
//Importing ENV variable from .env
const env = process.env.NODE_ENV;

const configDetails = JSON.stringify(config)

//Launching express server on specified port
app.listen(port, () => {

    //Printing context data in logs
    logger.info(`App is running at http://localhost:${port}`)
    logger.info(`App environment set to "${env}"`)
    logger.info(`Config details : ${configDetails}`)

    //Connect app to MongoDB
    // connect();
    //Define app routes
    routes(app);
    //Run swagger documentation server
    swaggerDocs(app, port);
});