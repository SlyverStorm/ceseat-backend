import multer from "multer";
import config from "config";
import logger from "../utils/logger";
import { customAlphabet } from "nanoid";

const imgDirectory = config.get<string>("images.destination");
const imgMaxSize = config.get<number>("images.maxSize");
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, imgDirectory);
//     },
//     filename: function(req, file, cb) {
//         cb(null, file.filename)
//     }
// });

const storage = multer.diskStorage(
    {
        destination: imgDirectory,
        filename: function ( req, file, cb ) {
            const ext = "." + file.mimetype.split("image/")[1];
            cb( null, nanoid() + ext);
        }
    }
);

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    if(file.mimetype.includes("image/")) {
        cb(false, true)
    }
    else {
        cb(new Error("File isn't an image"), false)
    }
};

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: imgMaxSize
    },
    //dest: imgDirectory,
    fileFilter: fileFilter
});