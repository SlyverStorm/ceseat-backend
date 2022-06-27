import mongoose from "mongoose";
import config from "config";
import logger from "./logger.util";

function connect(){
    const dbUri = config.get<string>("connect.dbUri");

    return mongoose.connect(dbUri)
    .then (() => {
        logger.info(`Connected to MongoDB Database - ${dbUri}`)
    }).catch((error) => {
        logger.fatal(`Unable to connect MongoDB Database - ${dbUri}`);
        process.exit(1);
    })
}

export default connect