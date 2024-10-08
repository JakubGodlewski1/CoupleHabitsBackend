import {NextFunction, Request, Response} from "express";
import {BadRequestError} from "../../../errors/customErrors.js";
import {userDb} from "../../../models/users/user.model.js";
import {UserDbSchema} from "../../../../types/user.js";

export const hasPartner = async (req:Request, res:Response, next:NextFunction) => {
    //get User id
    const {partnerId} = res.locals.user

    //validate that they don't have a partner
    if(!partnerId){
        throw new BadRequestError("You can't create a habit without a partner")
    }

    const partner:(UserDbSchema | null) =await userDb.findOne({id: partnerId})

    if (!partner){
        throw new BadRequestError("The provided partner id does not match any user from our db")
    }

    res.locals.partner = partner
    next()
}