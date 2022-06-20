import jwt from "jsonwebtoken";
import config from "config";

export function signJwt(
    object: Object,
    keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
    options?: jwt.SignOptions | undefined
) {
    return jwt.sign(
        object, 
        config.get<string>("jwt."+keyName), 
        {
            ...(options && options),
            algorithm: "RS256",
        }
    );
}

export function verifyJwt(
    token: string,
    keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
  ) {
    // const publicKey = Buffer.from(config.get<string>("jwt."+keyName), "base64").toString(
    //   "ascii"
    // );
  
    try {
      const decoded = jwt.verify(token, config.get<string>("jwt."+keyName));
      return {
        valid: true,
        expired: false,
        decoded,
      };
    } catch (e: any) {
      return {
        valid: false,
        expired: e.message === "jwt expired",
        decoded: null,
      };
    }
  }