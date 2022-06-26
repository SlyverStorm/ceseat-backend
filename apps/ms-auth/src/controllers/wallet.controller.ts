import { Request, Response } from "express";
import { GetUserInput, UpdateUserInput } from "../schemas/user.schema";
import logger from "../utils/logger.util";
import { deleteUser, getAllUsers, getUser, updateUser } from "../services/user.service"
import { deleteImage, updateImage, getImage } from "../utils/images.util";
import path from "path";
import config from "config";
import { CreateWalletInput, DeleteWalletInput, GetWalletInput, UpdateWalletInput } from "../schemas/wallet.schema";
import { createWallet, deleteWallet, getAllWallets, getWallet, updateWallet } from "../services/wallet.service";

export async function createWalletHandler(
    req: Request<{}, {}, CreateWalletInput["body"]>, 
    res: Response
) {
    const body = req.body;
    const userid = res.locals.user.id;
    if (!userid) return res.status(404).send("User id not found");

    logger.debug("Checking user: " + userid);
    //Check if user exists
    let user;
    try {
        user = await getUser(userid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!user) return res.sendStatus(404)

    logger.debug("Creating wallet for user: " + userid);
    //Create new wallet info for the user
    let wallet;
    try {
        wallet = await createWallet(userid, body);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!wallet) return res.sendStatus(500)
    return res.send(wallet);
}

export async function getWalletHandler(
    req: Request<GetWalletInput["params"], {}, {}>,
    res: Response,
) {
    const userid = res.locals.user.id;
    if (!userid) return res.status(404).send("User id not found");
    const walletid = req.params.walletid;

    //Check if user exists
    let user;
    try {
        user = await getUser(userid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!user) return res.sendStatus(404)

    //Get all wallets info for the user
    let wallet;
    try {
        wallet = await getWallet(userid, walletid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!wallet) return res.sendStatus(404)
    return res.send(wallet);
}

export async function getAllWalletsHandler(
    req: Request,
    res: Response,
) {
    const userid = res.locals.user.id;
    if (!userid) return res.status(404).send("User id not found");

    //Check if user exists
    let user;
    try {
        user = await getUser(userid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!user) return res.sendStatus(404)

    //Get all wallets info for the user
    let wallets;
    try {
        wallets = await getAllWallets(userid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!wallets) return res.sendStatus(404)
    return res.send(wallets);
}

export async function updateWalletHandler(
    req: Request<UpdateWalletInput["params"]>,
    res: Response
) {
    const body = req.body;
    const userid = res.locals.user.id;
    if (!userid) return res.status(404).send("User id not found");
    const walletid = req.params.walletid;
    
    //Check if wallet exists
    let user;
    try {
        user = await getUser(userid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!user) return res.sendStatus(404)

    //Check if wallet exists
    let wallet;
    try {
        wallet = await getWallet(userid, walletid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!wallet) return res.sendStatus(404)

    //Update wallet info for the user
    let walletUpdate;
    try {
        walletUpdate = await updateWallet(walletid, body);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!walletUpdate) return res.sendStatus(500)
    return res.send(walletUpdate);
}

export async function deleteWalletHandler(
    req: Request<DeleteWalletInput["params"]>,
    res: Response
) {
    const userid = res.locals.user.id;
    if (!userid) return res.status(404).send("User id not found");
    const walletid = req.params.walletid;
    
    //Check if wallet exists
    let user;
    try {
        user = await getUser(userid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!user) return res.sendStatus(404)

    //Check if wallet exists
    let wallet;
    try {
        wallet = await getWallet(userid, walletid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!wallet) return res.sendStatus(404)

    //Delete wallet info for the user
    let deletion;
    try {
        deletion = await deleteWallet(walletid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!deletion) return res.sendStatus(500)
    return res.send({
        message: "Wallet was deleted with success",
        deletedId: deletion.id
    });
}