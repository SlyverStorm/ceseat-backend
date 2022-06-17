import { Prisma, PrismaClient } from "@prisma/client";
import prismaClient from "../middleware/prisma";
import logger from "../utils/logger";

const prisma = prismaClient

export async function createUser(body: any, imgpath: string | null) {

  const data = {
      image: imgpath,
      ...body
  };

  try {
    return await prisma.user.create({data: data});
  }
  catch  (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        logger.debug(`Unable to create user: unique constraint violation on ${JSON.stringify(e.meta)}`)
        throw {
          status: 400,
          msg: "Unique constraint violation",
          ...e.meta
        }
      }
      logger.error(`Prisma encountered an error creating user: ${e} | body sent: ${body}`)
      throw e
    }
  }
  
}

export async function getUser(_id: string) {
    return prisma.user.findUnique({
        where: {
          id: _id,
        },
      })
}

export async function getAllUsers() {
    return await prisma.user.findMany()
}

export async function updateUser(_id: string, body: any) {
  try{
    return await prisma.user.update({
        where: {
            id: _id,
          },
          data: {
            ...body
          },
    })
  }
  catch  (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        logger.debug(`Unable to uspdate user: unique constraint violation on ${JSON.stringify(e.meta)}`)
        throw {
          status: 400,
          msg: "Unique constraint violation",
          ...e.meta
        }
      }
      logger.error(`Prisma encountered an error creating user: ${e} | body sent: ${body}`)
      throw e
    }
  }
}

export async function deleteUser(_id: string) {
  return prisma.user.delete({
    where: {
      id: _id,
    },
  })
};