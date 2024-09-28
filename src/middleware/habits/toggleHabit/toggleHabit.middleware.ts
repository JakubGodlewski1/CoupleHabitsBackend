import {NextFunction, Request, Response} from "express";
import {toggleHabitValidator} from "../../../validators/habit.validator";
import {BadRequestError} from "../../../errors/customErrors";

export const validateToggleHabitBody = (req:Request, res:Response, next:NextFunction) => {

    if (!req.body){
        throw new BadRequestError("No data provided");
    }

    //validate the req.body
    const result = toggleHabitValidator.safeParse(req.body)
    if (!result.success){
        console.log(result.error.flatten())
        throw new BadRequestError("Provided body is not valid")
    }

    next()
}