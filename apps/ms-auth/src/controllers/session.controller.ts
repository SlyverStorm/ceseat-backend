import config from "config";
import { Request, Response } from "express";
import { CreateSessionInput } from "../schemas/session.schema";
import { createSession, deleteSession, getAllSessions, getSessions } from "../services/session.service";
import { validateUserCredentials } from "../services/user.service";
import { signJwt } from "../utils/jwt.util";
import logger from "../utils/logger.util";


export async function createSessionHandler(
    req: Request<{}, {}, CreateSessionInput["body"]>, 
    res: Response
) {

    const sessionInput = req.body

    //Validate the user's password
    const validation = await validateUserCredentials(sessionInput);
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
            id: user.id,
            session: session.id,
            role: user.roleId
        },
        "accessTokenPrivateKey",
        {
            expiresIn: config.get<string>("jwt.accessTokenTtl")
        }
    );

    //Create a refresh token
    const refreshToken = signJwt(
        {
            id: user.id,
            session: session.id,
            role: user.roleId
        },
        "refreshTokenPrivateKey",
        {
            expiresIn: config.get<string>("jwt.refreshTokenTtl")
        }
    );

    //Return access and refresh token
    res.setHeader("x-access-token", accessToken);
    res.setHeader("x-refresh-token", refreshToken);
    return res.send({
        roleId: user.roleId,
        name: user.name,
        surname: user.surname,
        email: user.email,
        image: user.image,
        phone: user.phone
    })
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
  
    return res.send({
      accessToken: null,
      refreshToken: null,
    });
  }