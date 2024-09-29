import { Request, Response, NextFunction } from 'express';
import {BadRequestError} from "../../../errors/customErrors";

export const validateAvatarFile = (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;

    // Check if the file is provided
    if (!file) {
        throw new BadRequestError('file is required');
    }

    // Check if the file is of an image type
    if (!file.mimetype.includes("image")) {
        throw new BadRequestError('Provided file type is not an image');
    }

    // Check file size (limit to 6MB)
    const maxSize = 6 * 1024 * 1024; // 6MB
    if (file.size > maxSize) {
        throw new BadRequestError(`Your image is too big. Maximum size is ${maxSize}. Your image size is` + file.size);
    }

    // If all checks pass, proceed to the next middleware
    next();
};