import {NextFunction, Request, Response} from "express";
import {userDb} from "../../../models/users/user.model";
import {BadRequestError} from "../../../errors/customErrors";

export const partnerExists = async (req:Request, res:Response, next:NextFunction) => {
    const {connectionCode} = req.body
    console.log(connectionCode)

    const partner = await userDb.findOne({connectionCode})

    if(!partner) {
        throw new BadRequestError("User with provided connectionCode does not exist")
    }

    res.locals.partner = partner
    next()
}