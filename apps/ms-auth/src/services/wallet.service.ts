import { Prisma } from "@prisma/client";
import prismaClient from "../middleware/prisma";
import logger from "../utils/logger.util";
import { getWalletOutput } from "../models/walletOutput.model";

const prisma = prismaClient

export async function createWallet(userid: string, body: any) {
  const data = {
    ...body,
    userId: userid
  }
  try {
    return await prisma.wallet.create({
      data: data,
      select: {
        ...getWalletOutput
      }
    });
  }
  catch  (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(`Prisma encountered an error creating wallet: ${e} | body sent: ${body}`)
      throw e
    }
  }
}

export async function getWallet(userid: string, _id: string) {
  return await prisma.wallet.findFirst({
    where: {
      id: _id,
      userId: userid,
      deleted: false
    },
    select: {
      ...getWalletOutput
    }
  })
}

export async function getAllWallets(userid: string) {
  return await prisma.wallet.findMany({
    where: {
      userId: userid,
      deleted: false
    },
    select: {
      ...getWalletOutput
    }
  })
}

export async function updateWallet(_id: string, body: any) {
  try{
    return await prisma.wallet.update({
        where: {
            id: _id
          },
          data: {
            ...body
          },
          select: {
            ...getWalletOutput
          }
    })
  }
  catch  (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(`Prisma encountered an error updating wallet: ${e} | body sent: ${body}`)
      throw e
    }
  }
}

export async function deleteWallet(_id: string) {
  return await prisma.wallet.update({
    where: {
      id: _id
    },
    data: {
      deleted: true
    }
  })
}