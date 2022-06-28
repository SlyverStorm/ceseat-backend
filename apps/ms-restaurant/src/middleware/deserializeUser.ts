import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.util";
import logger from "../utils/logger.util"

function parseCookies (request: Request) {
    const list = {};
    const cookieHeader = request.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        // @ts-ignore
        list[name] = decodeURIComponent(value);
    });

    return list;
}

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const accessToken = parseCookies(req)['access-token'].replace(/^Bearer\s/, "");
    //const accessToken = get(req, "cookies.access-token", "").replace(/^Bearer\s/, "");

    logger.info(JSON.stringify(accessToken));

    if (!accessToken) return next();

    const { decoded } = verifyJwt(accessToken)
    if ( decoded ) {
        res.locals.user = decoded;
    }
    return next();
}

export default deserializeUser;