import { Request, Response } from "express";
import { CreateUserInput, GetUserInput, UpdateUserInput, DeleteUserInput } from "../schemas/user.schema";
import logger from "../utils/logger.util";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../services/user.service"
import { deleteImage, updateImage, getImage } from "../utils/images.util";
import path from "path";

export async function createUserHandler(
    req: Request<{}, {}, CreateUserInput["body"]>, 
    res: Response
) {

    const body = req.body;
    let filepath
    if (req.file) {
        filepath = req.file.filename
    } else {
        filepath = null;
    }

    //logger.debug(`Creating new user from request...`)
    try {
        const user = await createUser(body, filepath);
        return res.send(user);
    }
    catch(e:any){
        if(req.file) deleteImage(req.file.filename);
        if (e.status) return res.status(e.status).send(e);
        return res.sendStatus(500);
    }
}

export async function getUserHandler(
    req: Request<GetUserInput["params"]>,
    res: Response
) {
    const _id = req.params._id;
    //logger.debug(`Fetching user from ${_id}...`)

    try {
        const user = await getUser(_id);
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
    res: Response
) {
    const _id = req.params._id;
    const update = req.body;
    //logger.debug(`Updating user from ${_id}...`)
    
    try {
        const user = await getUser(_id);
        if (!user) return res.sendStatus(404); // 404: When user do not exist
        if (req.file && user.image == null) update.image = req.file.filename // Handle when user created an account without an image

        const updatedUser = await updateUser(_id, update);
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
    res: Response
) {
    const _id = req.params._id;
    //logger.debug(`Deleting user from ${_id}...`)

    try {
        const product = await getUser(_id);
        if (!product) return res.sendStatus(404);
    
        const deletion = await deleteUser(_id);
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
    if (imagepath != null) res.sendFile(path.join(__dirname, "../../",imagepath));
    else res.sendFile(path.join(__dirname, "../../images/default.png"));
}