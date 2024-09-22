import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { NextFunction, Request, Response } from "express";

export const validateAuth = () => {
    return [
        ClerkExpressWithAuth(),
        (req: Request, res: Response, next: NextFunction) => {
            console.log(req.auth);
            next();
        },
    ];
};