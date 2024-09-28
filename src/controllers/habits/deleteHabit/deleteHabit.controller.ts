import {habitDb} from "../../../models/habits/habit.model";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";

export const deleteHabit = async (req:Request,res:Response) => {
    const habitId = req.params.id;
    await habitDb.findByIdAndDelete(habitId)

    res.status(StatusCodes.OK).json({message:"Habit deleted"})
}