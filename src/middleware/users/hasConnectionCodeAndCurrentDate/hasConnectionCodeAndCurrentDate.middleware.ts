import {NextFunction, Request, Response} from "express";
import {BadRequestError} from "../../../errors/customErrors";
import {isValidDate} from "../../../utils/isValidDate/isValidDate";

export const hasConnectionCodeAndCurrentDate = (req:Request, res:Response, next:NextFunction) => {
    //get connection code and last time completed date (current date)
    const {connectionCode, lastTimeCompleted} = req.body
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

/*validate lastTimeCompleted*/

    //validate if lastTimeCompleted is passed
    if(!lastTimeCompleted) {
        throw new BadRequestError("lastTimeCompleted is missing")
    }

    //check if the date is correct

    if (!isValidDate(lastTimeCompleted)){
        console.log(req.body.lastTimeCompleted)
        throw new BadRequestError("lastTimeCompleted is not a valid date")
    }

    next()
}