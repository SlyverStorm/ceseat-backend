import { Prisma } from "@prisma/client";
import prismaClient from "../middleware/prisma";
import logger from "../utils/logger.util";
import { getAddressOutput } from "../models/addressOutput.model";

const prisma = prismaClient

export async function createAddress(userid: string, body: any) {
  const data = {
    ...body,
    userId: userid
  }
  try {
    return await prisma.address.create({
      data: data,
      select: {
        ...getAddressOutput
      }
    });
  }
  catch  (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(`Prisma encountered an error creating address: ${e} | body sent: ${body}`)
      throw e
    }
  }
}

export async function getAddress(userid: string, _id: string) {
  return await prisma.address.findFirst({
    where: {
      id: _id,
      userId: userid,
      deleted: false
    },
    select: {
      ...getAddressOutput
    }
  })
}

export async function getAllAddresses(userid: string) {
  return await prisma.address.findMany({
    where: {
      userId: userid,
      deleted: false
    },
    select: {
      ...getAddressOutput
    }
  })
}

export async function updateAddress(_id: string, body: any) {
  try{
    return await prisma.address.update({
        where: {
            id: _id
          },
          data: {
            ...body
          },
          select: {
            ...getAddressOutput
          }
    })
  }
  catch  (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(`Prisma encountered an error updating address: ${e} | body sent: ${body}`)
      throw e
    }
  }
}

export async function deleteAddress(_id: string) {
  return await prisma.address.update({
    where: {
      id: _id
    },
    data: {
      deleted: true
    }
  })
}