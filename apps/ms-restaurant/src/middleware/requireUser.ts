import { NextFunction, Request, Response } from "express"
import { request } from "http";
import logger from "../utils/logger.util"

function verifyAuth(req: Request) {

    let options = {
        host: 'localhost',
        port: 4100,
        path: '/verify/all',
        method: 'GET',
        headers: {
            'Cookie': req.headers.cookie
        }
    };

    let authRequest = request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    })
    authRequest.write("")
    authRequest.end()

}

const requireUser = (req: Request, res: Response, next: NextFunction) => {

    // logger.info(JSON.stringify(req.headers))

    verifyAuth(req)

    if (res.locals.user && res.locals.user.role === 3) return next()
    else {
        // res.locals.user = {
        //     id: "user_adminadmin" 
        // }
        // return next()
        return res.sendStatus(403)
    }
}

export default requireUser