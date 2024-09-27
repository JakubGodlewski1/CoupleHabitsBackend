import {NextFunction, Request, Response} from "express";
import {BadRequestError} from "../../errors/customErrors";
import {createHabitValidator} from "../../validators/habit.validator";

export const validateCreateHabitBody = (req:Request, res:Response, next: NextFunction) => {
    const createHabitData = req.body

    //check if the habit exists
    if (!createHabitData){
        throw new BadRequestError("You must provide a habit")
    }

    //validate habit
    const result = createHabitValidator.safeParse(createHabitData)
    if (!result.success){
       throw new BadRequestError("The provided habit is invalid")
    }

    next()
}