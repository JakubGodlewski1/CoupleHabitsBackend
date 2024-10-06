import {NextFunction, Request, Response} from "express";
import {ClerkExpressWithAuth} from "@clerk/clerk-sdk-node";

export const validateClerkToken = ()=> {
    const validation = (req: Request, res: Response, next: NextFunction) => {
        if (!req.auth?.userId){
            throw new Error("User's token could not be validated")
        }
        else next()
    }
    return [ClerkExpressWithAuth(), validation];
}