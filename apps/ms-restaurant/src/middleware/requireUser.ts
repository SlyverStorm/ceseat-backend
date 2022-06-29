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
            path: '/sessions/verify/' + path,
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

    // let deserializedToken = null
    // let authRequest = request(options, (res) => {
    //     console.log(`STATUS: ${res.statusCode}`);
    //     console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    //     res.setEncoding('utf8');
    //     res.on('data', (chunk) => {
    //         console.log(`BODY: ${chunk}`);
    //         if (res.statusCode === 200) deserializedToken = JSON.parse(chunk);
    //     });
    //     res.on('end', () => {
    //         console.log('No more data in response.');
    //     });
    // })
    // authRequest.write("")
    // authRequest
    // authRequest.end()

    // return deserializedToken;

}

const requireUser = async (req: Request, res: Response, next: NextFunction) => {

    // console.log(await verifyAuth(req, "restaurant"))

    const user: any = await verifyAuth(req, "restaurant");

    if (user != null && user.role === 3) {
        res.locals.user = user;
        return next()
    }
    else {
        // res.locals.user = {
        //     id: "user_adminadmin" 
        // }
        // return next()
        return res.sendStatus(403)
    }
}

export default requireUser