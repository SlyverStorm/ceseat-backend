import { Request, Response } from "express";
import { CreateUserInput, GetUserInput, UpdateUserInput, DeleteUserInput } from "../schemas/user.schema";
import logger from "../utils/logger.util";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../services/user.service"
import { deleteImage, updateImage, getImage } from "../utils/images.util";
import path from "path";
import config from "config";
import { createSession } from "../services/session.service";
import { signJwt } from "../utils/jwt.util";

//User creation handler for commercial users
export async function createUserHandler(
    req: Request<{}, {}, CreateUserInput["body"]>, 
    res: Response,
    roleId: number = 1
) {
    const body = {
        ...req.body,
        roleId: roleId
    }
    let filepath
    if (req.file) {
        filepath = req.file.filename
    } else {
        filepath = null;
    }

    //Create new user
    let user;
    try {
        user = await createUser(body, filepath);
        
    }
    catch(e:any){
        if(req.file) deleteImage(req.file.filename);
        if (e.status) return res.status(e.status).send(e);
        return res.sendStatus(500);
    }

    //Create session
    if (!user) return res.sendStatus(500)
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
    return res.send({...user, id: undefined, roleId: undefined});
}

export async function getUserHandler(
    req: Request<GetUserInput["params"]>,
    res: Response,
    returnId: boolean = false,
    self: boolean = true
) {
    let _id: string
    if (res.locals.user && self) _id = res.locals.user.id
    else _id = req.params.userid;
    //logger.debug(`Fetching user from ${_id}...`)

    try {
        const user = await getUser(_id, returnId);
        if (!user) return res.sendStatus(404);
        return res.send(user);
    }
    catch(e) {
        const msg = JSON.stringify(e)
        logger.error(`Prisma encountered an error getting user: ${msg} | id sent: ${_id}`)
        return res.sendStatus(500)
    }
}

export async function getAllUsersHandler(
    req: Request,
    res: Response
) {
    //logger.debug(`Fetching all users...`)
    try {
        const users = await getAllUsers();
        if (!users) return res.sendStatus(404);
        return res.send(users);
    }
    catch(e) {
        const msg = JSON.stringify(e)
        logger.error(`Prisma encountered an error getting all users: ${msg}`)
        return res.sendStatus(500)
    }
}

export async function updateUserHandler(
    req: Request<UpdateUserInput["params"]>,
    res: Response,
    returnId: boolean = false,
    self: boolean = true
) {
    let _id: string
    if (res.locals.user && self) _id = res.locals.user.id
    else _id = req.params.userid;
    const update = req.body;
    //logger.debug(`Updating user from ${_id}...`)
    
    try {
        const user = await getUser(_id, returnId);
        if (!user) return res.sendStatus(404); // 404: When user do not exist
        if (user.role.name === "commercial" || user.role.name === "technical") return res.sendStatus(403); // 403: When user has commercial or technical role
        if (req.file && user.image == null) update.image = req.file.filename // Handle when user created an account without an image

        const updatedUser = await updateUser(_id, update, returnId);
        if(req.file && user.image != null && updatedUser?.image != null) updateImage(req.file, updatedUser.image); // Handle image replace when updating a user with another image
        return res.send(updatedUser);
    }
    catch(e:any) {
        if(req.file) deleteImage(req.file.filename);
        if (e.status) return res.status(e.status).send(e);
        return res.sendStatus(500);
    }
}

export async function deleteUserHandler(
    req: Request<GetUserInput["params"]>,
    res: Response,
    self: boolean = true
) {
    let _id: string
    if (res.locals.user && self) _id = res.locals.user.id
    else _id = req.params.userid;
    //logger.debug(`Deleting user from ${_id}...`)

    try {
        const user = await getUser(_id, true);
        if (!user) return res.sendStatus(404); // 404: When user do not exist
        if (user.role.name === "commercial" || user.role.name === "technical") return res.sendStatus(403); // 403: When user has commercial or technical role
    
        const deletion = await deleteUser(_id, user.email, user.phone);
        if (deletion.image != null) deleteImage(deletion.image)
        return res.send({
            message: "User was deleted with success",
            deletedId: deletion.id
        });
    }
    catch(e) {
        const msg = JSON.stringify(e)
        logger.error(`Prisma encountered an error updating users: ${msg} | id sent: ${_id}`)
        return res.sendStatus(500)
    }
}

export async function getUserImageHandler(
    req: Request,
    res: Response
) {
    const imgId = req.params.img;
    //logger.debug(`Getting image from ${imgId}...`)

    const imagepath = await getImage(imgId);
    logger.warn(imagepath)
    if (imagepath != null) res.sendFile(imagepath);
    else {
        logger.warn(config.get<string>("images.destination"), "default.png")
        res.sendFile(path.join(config.get<string>("images.destination"), "default.png"));
    }
}