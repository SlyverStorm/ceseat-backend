import { NextFunction, Request, Response } from "express"
import { request } from "http";
import config from "config"
import logger from "../utils/logger.util"

function verifyAuth(req: Request, path: "all" | "customer" | "driver" | "restaurant" | "commercial" | "technical") {

    return new Promise((resolve, reject) => {

        if (!req.headers.cookie) resolve(null);

        const options = {
            host: config.get<string>("connect.authHost"),
            port: config.get<number>("connect.authPort"),
            path: '/verify/' + path,
            method: 'GET',
            headers: {
                'Cookie': req.headers.cookie
            }
        };

        let deserializedToken: any = null
        const authReq = request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                if (res.statusCode === 200) deserializedToken = JSON.parse(chunk);
                resolve(deserializedToken);
            }
            );
        });
        authReq.on('error', (e) => {
            reject(e);
        })
        authReq.write("");
        authReq.end();
    });

}

const userrole = {
    customer: 1,
    driver: 2,
    restaurant: 3,
    commercial: 4,
    technical: 5,
    all: null
}

const requireUser = (roleName: "customer" | "driver" | "restaurant" | "commercial" | "technical" | "all") =>
async (req: Request, res: Response, next: NextFunction) => {

    // console.log(await verifyAuth(req, "restaurant"))

    const user: any = await verifyAuth(req, roleName);

    if (user != null) {
        if (userrole[roleName] === null || user.role === userrole[roleName]) {
            res.locals.user = user;
            return next()
        }
    }
    return res.sendStatus(403)
}

export default requireUser