import { beforeEach, describe, expect, it } from "vitest";
import { NextFunction, Request, Response } from "express";
import { validateAvatarFile } from "./validateAvatar.middleware";

describe("validateAvatar middleware", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    const file = {
        fieldname: 'avatar',
        originalname: 'profile-pic.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: '',
        filename: 'abc1234.jpg',
        path: 'uploads/abc1234.jpg',
        size: 512000,
    };

    beforeEach(() => {
        req = {} as Request;  // Properly reassigning req
        res = {} as Response;
        next = vi.fn();
    });

    it('should throw an error if no file is provided', () => {
        expect(() => validateAvatarFile(req, res, next)).toThrowError(/file is required/i);
    });

    it('should throw an error if file is not of image type', () => {
        req.file = { ...file, mimetype: "text/plain" } as any;  // Correctly assigning req.file
        expect(() => validateAvatarFile(req, res, next)).toThrowError(/is not an image/i);
    });

    it('should throw an error if image is too big', () => {
        req.file = { ...file, size: 6 * 1024 * 1024 + 1 } as any; // Correctly assigning req.file
        expect(() => validateAvatarFile(req, res, next)).toThrowError(/too big/i);
    });

    it('should call next if everything is ok', () => {
        req.file = file as any; // Assigning file here
        validateAvatarFile(req, res, next);
        expect(next).toHaveBeenCalled();  // Check if next was called
    });
});