import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { reIssueAccessToken } from "../services/session.service";
import { verifyJwt } from "../utils/jwt.util";
import log from "../utils/logger.util";
import logger from "../utils/logger.util"

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {

    const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    const refreshToken = get(req, "headers.x-refresh");
    if (!accessToken) return next();

    const {decoded, expired} = verifyJwt(accessToken, "accessTokenPublicKey")
    if (decoded) {
        res.locals.user = decoded;
        return next();
    }

    if (expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken({refreshToken});

        if (newAccessToken) res.setHeader("x-access-token", newAccessToken);
        else {
            log.debug(`refresh token expired, decode:${decoded}; expired:${expired}`)
            return res.status(403).send("session token expired");
        }

        const result = verifyJwt(newAccessToken, "accessTokenPublicKey");
        res.locals.user = result.decoded;
    }

    return next();
}

export default deserializeUser;