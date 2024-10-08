import {NextFunction, Request, Response} from "express";
import {BadRequestError} from "../../../errors/customErrors.js";

export const hasNoPartner = (req:Request, res:Response, next:NextFunction) => {
    //get User id
    const {partnerId} = res.locals.user

    //validate that they don't have a partner
    if(partnerId){
        throw new BadRequestError("You already have a partner")
    }

    next()
}