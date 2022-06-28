import jwt from "jsonwebtoken";
import config from "config";
import process from "process";

export function verifyJwt(
    token: string,
  ) {
    const accessKey = process.env.ACCESS_TOKEN_PUBLIC_KEY
    if (!accessKey) {
      return {
        valid: false,
        expired: false,
        decoded: null,
      };
    }
    try {
      const decoded = jwt.verify(token, accessKey);
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