import { Prisma } from "@prisma/client";
import prismaClient from "../middleware/prisma";
import logger from "../utils/logger.util";
import bcrypt from "bcrypt"
import { CreateSessionInput } from "../schemas/session.schema";
import { commGetUserOutput, getUserOutput } from "../models/userOutput.model";

const prisma = prismaClient

export async function createUser(body: any, imgpath: string | null) {
 
  const data = {
      image: imgpath,
      ...body
  };

  try {
    return await prisma.user.create({
      data: data,
      select: {
        ...getUserOutput
      }
    });
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

export async function getUser(_id: string, returnId: boolean = false) {

    const outputSchema = returnId ? commGetUserOutput : getUserOutput

    return prisma.user.findUnique({
        where: {
          id: _id,
        },
        select: {
          ...outputSchema
        }
      })
}

// A supprimer ou refaire pour quelle soit accéssible par certain users
export async function getAllUsers() {
    return await prisma.user.findMany({
      select: {
        ...commGetUserOutput
      }
    })
}

export async function updateUser(_id: string, body: any, com: boolean = false) {

  const outputSchema = com ? commGetUserOutput : getUserOutput

  try{
    return await prisma.user.update({
        where: {
            id: _id,
          },
          data: {
            ...body
          },
          select: {
            ...outputSchema
          }
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

export async function validateUserCredentials(credentials: CreateSessionInput["body"]/*email: string, password: string*/) {
  const user = await prisma.user.findUnique({
    where: {
      email: credentials.email
    },
  });
  if (!user) return { valid: false, user: null};

  const isValid = await bcrypt.compare(credentials.password, user.password)
  if(!isValid) return  {valid: isValid, user: null};
  return {valid: isValid, user: user};
};