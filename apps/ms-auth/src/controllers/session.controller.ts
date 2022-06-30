import config from "config";
import { Request, Response } from "express";
import { CreateSessionInput } from "../schemas/session.schema";
import { createSession, deleteSession, getAllSessions, getSessions } from "../services/session.service";
import { getUser, validateUserCredentials } from "../services/user.service";
import { signJwt } from "../utils/jwt.util";
import logger from "../utils/logger.util";


export async function createSessionHandler(
    req: Request<{}, {}, CreateSessionInput["body"]>, 
    res: Response
) {

    const sessionInput = req.body

    //Validate the user's password
    const validation = await validateUserCredentials(sessionInput);
    if(validation.suspension) return res.status(403).send("User is suspended");
    if(!validation.valid) return res.status(401).send("Invalid email or password");

    //Create session
    const user = validation.user
    if (user === null) return res.sendStatus(500)
    let session
    try {
        session = await createSession(user.id, req.get("user-agent") || "")
    }
    catch (e) {
        return res.status(500).send(e)
    }
    

    //Create an access token
    const accessToken = signJwt(
        {
            ...user,
            session: session.id,
            role: user.role.id,
        },
        "accessTokenPrivateKey",
        {
            expiresIn: config.get<string>("jwt.accessTokenTtl")
        }
    );

    //Create a refresh token
    const refreshToken = signJwt(
        {
            ...user,
            session: session.id,
            role: user.role.id
        },
        "refreshTokenPrivateKey",
        {
            expiresIn: config.get<string>("jwt.refreshTokenTtl")
        }
    );

    //Return access and refresh token
    res.cookie("access-token", 'Bearer ' + accessToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    })
    res.cookie("refresh-token", 'Bearer ' + refreshToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    })

    await getUser(user.id, false, true)
    .then(user => res.send(user))
    .catch(e => res.status(500).send(e))
    //res.send({accessToken, refreshToken, roleId: user.roleId})
}

export async function getSessionsHandler(
    req: Request,
    res: Response
){
    try {
        const userId = res.locals.user.id
        logger.info(JSON.stringify(userId))
        const sessions = await getSessions(userId)
        logger.info(JSON.stringify(sessions))
        return res.send(sessions)
    }
    catch (e) {
        return res.status(500).send(e)
    }
    
}

export async function getAllSessionsHandler(req: Request, res: Response) {
    try {
        const sessions = await getAllSessions()
        return res.send(sessions)
    }
    catch (e) {
        return res.status(500).send(e)
    }
}

export async function deleteSessionHandler(req: Request, res: Response) {

    const sessionId = res.locals.user.session;
    await deleteSession(sessionId);
  
    res.clearCookie("access-token");
    res.clearCookie("refresh-token");
    return res.send({
      accessToken: null,
      refreshToken: null,
    });
  }