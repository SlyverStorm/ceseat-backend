import { adminUser, roles } from "./default";
import { PrismaClient } from "@prisma/client";
import logger from "../src/utils/logger.util"

const prisma = new PrismaClient();

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