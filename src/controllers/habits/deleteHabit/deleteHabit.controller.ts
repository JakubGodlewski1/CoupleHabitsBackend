import {habitDb} from "../../../models/habits/habit.model.js";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {
    validateGlobalStrikeWhileRemoving
} from "./helpers/validateGlobalStrikeWhileDeleting/validateGlobalStrikeWhileDeleting.js";
import mongoose from "mongoose";

export const deleteHabit = async (req:Request,res:Response) => {
    const habitId = req.params.id;
    const {user} = res.locals

    //if the habit was scheduled for today and it was not completed and all other habits scheduled for today have been completed,
    //and it was not the only habit scheduled for today, increase the global strike and points
    await validateGlobalStrikeWhileRemoving(new mongoose.Types.ObjectId(habitId), user)
    await habitDb.findByIdAndDelete(habitId)

    res.status(StatusCodes.OK).json({message:"Habit deleted"})
}