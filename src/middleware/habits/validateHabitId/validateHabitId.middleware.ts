import {NextFunction, Request, Response} from "express";
import {BadRequestError} from "../../../errors/customErrors";
import mongoose from "mongoose";
import {habitDb} from "../../../models/habits/habit.model";
import {HabitDbSchema} from "../../../../types/habit";

export const validateHabitId = async (req:Request, res:Response, next:NextFunction) => {
    const habitId = req.params.id;
    const user = res.locals.user

    //check if the given id exists
    if (!habitId){
        throw new BadRequestError("You did not provide habit id")
    }

    //check if the id is of type mongodb.objectId
    if(!mongoose.isValidObjectId(habitId)){
        throw new Error("Provided habit id is not valid")
    }

    //check if the habit exists
    const habit:(HabitDbSchema | null) = await habitDb.findById(habitId)
    if(!habit){
        throw new Error("A habit with given id does not exist")
    }

    //check if the habit belongs to the signed up user
    if (!habit.details.some((userData)=> {
        return userData.userId === user.id
    })){
        throw new Error("Not authorized")
    }

    next()
}