import express from "express";
import 'dotenv/config';
import config from "config";
import logger from "./utils/logger.util"
import routes from "./routes";
import swaggerDocs from "./utils/swagger.util";
import cors from "cors";
import deserializeUser from "./middleware/deserializeUser"
import prisma from "./middleware/prisma";
import requestLogger from "./middleware/requestLogger";
import cookieParser from "cookie-parser";

//Displaying context data (app name and version) from configuration :
const appName = config.get<number>("context.appName");
const appVersion = config.get<number>("context.version");
logger.info(`Starting ${appName} V${appVersion} ...`);

// const whitelist = [
//     'http://localhost:4000',
//     'http://localhost:4001',
//     'http://localhost:4002',
//     'http://localhost:4003',
//   ];

//Creating express app
const app = express();
//Using express json parser to handle request body handling
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        callback(null, true);
      },
    })
  );
app.use(requestLogger);
app.use(deserializeUser);


//Importing listen port from configuration
const port = config.get<number>("connect.port");
//Importing ENV variable from .env
const env = process.env.NODE_ENV;

const configDetails = JSON.stringify({...config, jwt: undefined})

//Launching express server on specified port
app.listen(port, () => {

    //Printing context data in logs
    logger.info(`App is running at http://localhost:${port}`)
    logger.info(`App environment set to "${env}"`)
    logger.info(`Config details : ${configDetails}`)

    //Connect app to MongoDB
    // connect();
    prisma.$connect().then(() => logger.info("Connected to db-mysql")).catch((e:any) => {
            logger.fatal(`prisma error ${e}`);
            process.exit(1);
        }
    );

    //Define app routes
    routes(app);
    //Run swagger documentation server
    swaggerDocs(app, port);
});