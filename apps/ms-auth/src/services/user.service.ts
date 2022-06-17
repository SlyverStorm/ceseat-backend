import { PrismaClient } from "@prisma/client";
import { customAlphabet } from "nanoid";
//import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
// import ProductModel, { ProductDocument } from "../models/product.model";

const prisma = new PrismaClient()
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export async function createUser(body: any, imgpath: string | null) {

  const data = {
      id: `user_${nanoid()}`,
      image: imgpath,
      ...body
  }
  return await prisma.user.create({data: data})
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
    return await prisma.user.update({
        where: {
            id: _id,
          },
          data: {
            ...body
          },
    })
}

export async function deleteUser(_id: string) {
  return prisma.user.delete({
    where: {
      id: _id,
    },
  })
}