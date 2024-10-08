import {NextFunction, Request, Response} from "express";
import {BadRequestError} from "../../../errors/customErrors.js";
import {createHabitValidator} from "../../../validators/habit.validator.js";
import * as console from "node:console";

export const validateCreateHabitBody = (req:Request, res:Response, next: NextFunction) => {
    const createHabitData = req.body

    //check if the habit exists
    if (!createHabitData){
        throw new BadRequestError("You must provide a habit")
    }

    //validate habit
    const result = createHabitValidator.safeParse(createHabitData)
    if (!result.success){
        console.error(result.error.flatten())
       throw new BadRequestError("The provided habit is invalid")
    }

    next()
}