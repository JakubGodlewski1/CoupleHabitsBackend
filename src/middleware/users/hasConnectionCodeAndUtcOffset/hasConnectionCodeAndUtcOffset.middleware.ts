import {NextFunction, Request, Response} from "express";
import {BadRequestError} from "../../../errors/customErrors";

export const hasConnectionCodeAndUtcOffset = (req:Request, res:Response, next:NextFunction) => {
    //get connection code and last time completed date (current date)
    const {connectionCode, utcOffset} = req.body
    const {connectionCode:currentUserConnectionCode} = res.locals.user

/* validate connection code*/
    if (!connectionCode) {
        throw new BadRequestError("Connection code is missing")
    }

    if(connectionCode.length !== 6){
        throw new BadRequestError("Connection code should be 6 characters long")
    }

    if(connectionCode===currentUserConnectionCode){
        throw new BadRequestError("You passed your own connection code")
    }


    //validate the code
    const validCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (const char of connectionCode) {
        if(!validCharacters.includes(char)) {
            throw new BadRequestError("Connection code contains invalid characters")
        }

    }

    //validate utcOffset
    if(!utcOffset){
        throw new BadRequestError("Utc offset is missing")
    }
        if(utcOffset > 14 || utcOffset < -12){
        throw new BadRequestError("UTC offset has to be between -12 and 14")
    }


    next()
}