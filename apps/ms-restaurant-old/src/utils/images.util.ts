import config from "config";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import { resolve } from "node:path";

const imgDirectory = config.get<string>("images.destination");

// Delete img from the stored img directory
// This function is used in two case
// - When an error occured in the input validation process or with prisma ORM
// - When an image has to be replaced by another one
export function deleteImage(filename: string){
    const path = imgDirectory + filename
    if (existsSync(path)) {
        fs.unlink(path)
    }
};

// Update an images by deleting the previous one and renaming the one with the same name
export function updateImage(context: Express.Multer.File, filename: string) {
    const previousImgPath = imgDirectory +  filename
    if (existsSync(previousImgPath)) {
        fs.unlink(previousImgPath)
    }

    const newImgPath = imgDirectory + context.filename
    if (existsSync(newImgPath)) {
        fs.rename(newImgPath, previousImgPath)
    }
}

export function getImage(filename: string) {
    const newImgPath = imgDirectory + filename
    if (existsSync(newImgPath)) {
        return newImgPath
    }
    return null
}