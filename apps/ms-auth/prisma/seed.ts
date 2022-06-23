import { adminUser, roles } from "./default";
import { PrismaClient } from "@prisma/client";
import logger from "../src/utils/logger.util"
import { customAlphabet } from "nanoid";
import bcrypt from "bcrypt"

const prisma = new PrismaClient();
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);


//User Id generation middleware
prisma.$use(async (params, next) => {
    
    if (params.action === "create" && params.model === "User") {
        let user = params.args.data;
        user.id = `user_${nanoid()}`;
    }
    return await next(params);
});

//Password encrypt middleware
prisma.$use(async (params, next) => {
    
    if (params.action === ("create" || "update") && params.model === "User") {
        let user = params.args.data;
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
    }
    return await next(params);
});

async function seedRoles() {
    logger.info(`Seed process initialized...`)

    await prisma.$connect().then(() => logger.info("Connected to db-mysql")).catch( e => {
        logger.fatal(e)
        process.exit(1)
    })

    for (let role of roles) {

        const existing = await prisma.role.findFirst({
            where: role
        })
        if (existing != null) continue;

        await prisma.role.create({
            data: role
        }).then(() => logger.debug(`Entry successfuly added: ${JSON.stringify(role)}`))
        
    }

    const existing = await prisma.user.findFirst({
        where: adminUser
    })
    if (existing === null) {
        await prisma.user.create({
            data: adminUser
        })
    }
    logger.info(`Seed process ended with success !`)
}

seedRoles().catch(e => {
    logger.error(e);
    process.exit(1);
}).finally(() => {
    prisma.$disconnect();
})