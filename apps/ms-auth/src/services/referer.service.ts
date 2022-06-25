import { Prisma, User } from "@prisma/client";
import prismaClient from "../middleware/prisma";
import { commGetUserOutput } from "../models/userOutput.model";
import logger from "../utils/logger.util";

const prisma = prismaClient

export async function createReferer(refererCode: string, newUser: any) {
  let refererUser;
  try {
    refererUser = await prisma.user.findUnique({
        where: {
            refererCode: refererCode
        }
    });
  }
  catch  (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(`Prisma encountered an error getting referer user: ${e}`)
      throw e
    }
    else {
      logger.error(`Unexepted error encountered getting referer user: ${e}`)
      throw e
    }
  }
  if (!refererUser) return newUser;

  let updatedUser;
  try {
    await prisma.referent.create({
      data: {
        referentUserId: refererUser.id,
        newUserId: newUser.id
      }
    })
    updatedUser = await prisma.user.findUnique({
        where: {
            id: newUser.id
        },
        select: {
        ...commGetUserOutput,
        roleId: true
        }
    })
  }
  catch  (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(`Prisma encountered an error getting referer user: ${e}`)
      throw e
    }
    else {
      logger.error(`Unexepted error encountered getting referer user: ${e}`)
      throw e
    }
  }

  return updatedUser;
}