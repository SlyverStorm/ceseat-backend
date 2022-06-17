import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import logger from "../utils/logger";
import { deleteImage } from "../utils/images";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    //logger.debug(`Request received printing body: ${JSON.stringify(req.body)}`)
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      if (req.file) deleteImage(req.file.filename);
      return res.status(400).send(e.errors);
    }
  };

export default validate;