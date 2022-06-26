import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";

const prismaClient = new PrismaClient()
const idGenerator = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);
const refererCodeGenerator = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);

//User Id generation middleware
prismaClient.$use(async (params, next) => {
    
    if (params.action === "create" && params.model === "User") {
        let user = params.args.data;
        user.id = `user_${idGenerator()}`;
        user.refererCode = `${refererCodeGenerator()}`;
    }
    return await next(params);
});

//Session Id generation middleware
prismaClient.$use(async (params, next) => {
    
    if (params.action === "create" && params.model === "Session") {
        let session = params.args.data;
        session.id = `session_${idGenerator()}`;
    }
    return await next(params);
});

//Wallet Id generation middleware
prismaClient.$use(async (params, next) => {
    
    if (params.action === "create" && params.model === "Wallet") {
        let session = params.args.data;
        session.id = `wallet_${idGenerator()}`;
    }
    return await next(params);
});

//Password encrypt middleware
prismaClient.$use(async (params, next) => {
    
    if (params.action === ("create" || "update") && params.model === "User") {
        let user = params.args.data;
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
    }
    return await next(params);
});

export default prismaClient;

