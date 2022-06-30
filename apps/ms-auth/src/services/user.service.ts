import { Prisma } from "@prisma/client";
import prismaClient from "../middleware/prisma";
import logger from "../utils/logger.util";
import bcrypt from "bcrypt"
import { CreateSessionInput } from "../schemas/session.schema";
import { commGetUserOutput, getUserOutput } from "../models/userOutput.model";
import dayjs from "dayjs";

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
        ...commGetUserOutput,
        roleId: true
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

export async function getUser(_id: string, returnId: boolean = false, self: boolean = true) {

    let whereArgs
    if (self) {
      whereArgs= {
        id: _id,
        deleted: false,
        isSuspended: false
      }
    }
    else {
      whereArgs= {
        id: _id,
        deleted: false
      }
    }

    const outputSchema = returnId ? commGetUserOutput : getUserOutput

    return prisma.user.findFirst({
        where: {
          ...whereArgs
        },
        select: {
          ...outputSchema
        }
      })
}

// A supprimer ou refaire pour quelle soit accéssible par certain users
export async function getAllUsers() {
    return await prisma.user.findMany({
      where: {
        deleted: false,
        //isSuspended: false
      },
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
            id: _id
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

export async function deleteUser(_id: string, previousEmail: string, previousPhone: string) {
  const prefix = dayjs().format("YYYY-MM-DD hh:mm:ss.SSS")
  return prisma.user.update({
    where: {
      id: _id,
    },
    data: {
      email: `del-${prefix}: ` + previousEmail,
      phone: `del-${prefix}: ` + previousPhone,
      deleted: true,
      image: null
    }
  })
};

export async function validateUserCredentials(credentials: CreateSessionInput["body"]/*email: string, password: string*/) {
  const user = await prisma.user.findFirst({
    where: {
      email: credentials.email,
      deleted: false
    },
    select: {
      ...commGetUserOutput,
      password: true
    }
  });
  if (!user) return { valid: false, user: null, suspension: false };

  if (user.isSuspended) return { valid: false, user: null, suspension: true };

  const isValid = await bcrypt.compare(credentials.password, user.password)
  if(!isValid) return  {valid: isValid, user: null, suspension: false}
  //@ts-ignore
  delete user.password
  return {valid: isValid, user: user, suspension: false};
};