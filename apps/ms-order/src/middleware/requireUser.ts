import { NextFunction, Request, Response } from "express"
import logger from "../utils/logger.util"

const requireUser = (req: Request, res: Response, next: NextFunction) => {

    logger.info(JSON.stringify(req.headers))

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