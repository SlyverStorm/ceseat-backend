import { Request, Response } from "express";
import logger from "../utils/logger.util";
import { getUser } from "../services/user.service"
import { CreateAddressInput, DeleteAddressInput, GetAddressInput, UpdateAddressInput } from "../schemas/address.schema";
import { createAddress, deleteAddress, getAllAddresses, getAddress, updateAddress } from "../services/address.service";

export async function createAddressHandler(
    req: Request<{}, {}, CreateAddressInput["body"]>, 
    res: Response
) {
    const body = req.body;
    logger.debug(JSON.stringify(body));
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

    logger.debug("Creating address for user: " + userid);
    //Create new address info for the user
    let address;
    try {
        address = await createAddress(userid, body);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!address) return res.sendStatus(500)
    return res.send(address);
}

export async function getAddressHandler(
    req: Request<GetAddressInput["params"], {}, {}>,
    res: Response,
) {
    const userid = res.locals.user.id;
    if (!userid) return res.status(404).send("User id not found");
    const addressid = req.params.addressid;

    //Check if user exists
    let user;
    try {
        user = await getUser(userid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!user) return res.sendStatus(404)

    //Get all addresses info for the user
    let address;
    try {
        address = await getAddress(userid, addressid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!address) return res.sendStatus(404)
    return res.send(address);
}

export async function getAllAddressesHandler(
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

    //Get all addresses info for the user
    let addresses;
    try {
        addresses = await getAllAddresses(userid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!addresses) return res.sendStatus(404)
    return res.send(addresses);
}

export async function updateAddressHandler(
    req: Request<UpdateAddressInput["params"]>,
    res: Response
) {
    const body = req.body;
    const userid = res.locals.user.id;
    if (!userid) return res.status(404).send("User id not found");
    const addressid = req.params.addressid;
    
    //Check if address exists
    let user;
    try {
        user = await getUser(userid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!user) return res.sendStatus(404)

    //Check if address exists
    let address;
    try {
        address = await getAddress(userid, addressid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!address) return res.sendStatus(404)

    //Update address info for the user
    let addressUpdate;
    try {
        addressUpdate = await updateAddress(addressid, body);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!addressUpdate) return res.sendStatus(500)
    return res.send(addressUpdate);
}

export async function deleteAddressHandler(
    req: Request<DeleteAddressInput["params"]>,
    res: Response
) {
    const userid = res.locals.user.id;
    if (!userid) return res.status(404).send("User id not found");
    const addressid = req.params.addressid;
    
    //Check if address exists
    let user;
    try {
        user = await getUser(userid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!user) return res.sendStatus(404)

    //Check if address exists
    let address;
    try {
        address = await getAddress(userid, addressid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!address) return res.sendStatus(404)

    //Delete address info for the user
    let deletion;
    try {
        deletion = await deleteAddress(addressid);
    }
    catch(e:any){
        return res.sendStatus(500);
    }
    if (!deletion) return res.sendStatus(500)
    return res.send({
        message: "Address was deleted with success",
        deletedId: deletion.id
    });
}