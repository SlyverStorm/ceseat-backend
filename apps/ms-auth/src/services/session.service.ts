import { Prisma } from "@prisma/client";
import config from "config";
import { get } from "lodash";
import prismaClient from "../middleware/prisma";
import { signJwt, verifyJwt } from "../utils/jwt.util";
import logger from "../utils/logger.util";
import { getUser } from "./user.service";

const prisma = prismaClient

export async function createSession(userId: string, userAgent: string) {

  const data = {
    userId: userId,
    userAgent: userAgent
  }

  try {
    return await prisma.session.create({data: data});
  }
  catch  (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(`Prisma encountered an error creating user: ${e} | data sent: ${data}`)
      throw e
    }
    else {
      logger.error(`Unexepted error encountered creating user: ${e} | data sent: ${data}`)
      throw e
    }
  }
  
}

export async function getSessions(userId: string) {

  try {
    return await prisma.session.findMany({
      where: {
        userId: userId,
        valid: true
      }
    });
  }
  catch  (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(`Prisma encountered an error creating user: ${e} | userId sent: ${userId}`)
      throw e
    }
    else {
      logger.error(`Unexepted error encountered creating user: ${e} | userId sent: ${userId}`)
      throw e
    }
  }
  
}

export async function deleteSession(sessionId: string) {
  try {
    return await prisma.session.update({
      where: {
          id: sessionId,
        },
        data: {
          valid: false
        }
    })
  }
  catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(`Prisma encountered an error creating user: ${e} | sessionId sent: ${sessionId}`)
      throw e
    }
    else {
      logger.error(`Unexepted error encountered creating user: ${e} | sessionId sent: ${sessionId}`)
      throw e
    }
  }
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded, expired } = verifyJwt(refreshToken, "refreshTokenPublicKey");
  if (expired) return false;

  if (!decoded || !get(decoded, "session")) return false;

  //const session = await SessionModel.findById(get(decoded, "session"));
  const session = await prisma.session.findUnique({
    where: {
      id: get(decoded, "session")
    }
  })

  if (!session || !session.valid) return false;

  const user = await getUser(session.userId);

  if (!user) return false;

  const accessToken = signJwt(
    { ...user, session: session.id },
    "accessTokenPrivateKey",
    { expiresIn: config.get("jwt.accessTokenTtl") } // 15 minutes
  );

  return accessToken;
}

