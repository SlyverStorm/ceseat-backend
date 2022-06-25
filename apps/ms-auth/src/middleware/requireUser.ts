import { NextFunction, Request, Response } from "express"
import logger from "../utils/logger.util"

const requireUser = (roleName: "customer" | "driver" | "restaurant" | "commercial" | "technical" | "all") =>
(req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user
    if (!user) return res.sendStatus(403)
    if (roleName != "all") {
        let roleIdRequired
        switch (roleName) {
            case "customer": 
                roleIdRequired = 1;
                break;
            case "driver":
                roleIdRequired = 2;
                break;
            case "restaurant":
                roleIdRequired = 3;
                break;
            case "commercial":
                roleIdRequired = 4;
                break;
            case "technical":
                roleIdRequired = 5;
                break;
        }
        logger.info(`roleName:${roleName}; roleIdRequired:${roleIdRequired}; user.roleId:${user.roleId}`)
        if (user.role != roleIdRequired) return res.sendStatus(403)
    }
    return next()
}

export default requireUser