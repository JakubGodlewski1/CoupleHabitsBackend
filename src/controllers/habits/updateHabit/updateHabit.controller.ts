import {Request, Response} from "express";
import {habitDb} from "../../../models/habits/habit.model.js";
import {StatusCodes} from "http-status-codes";
import {habitConverter} from "../../../lib/habits/habitConverter.js";

export const updateHabit = async (req:Request, res:Response) =>{
    const updatedHabitData = req.body;
    const id = req.params.id
    const {user} = res.locals

    const toDbUpdate = habitConverter.fromFrontendHabitToDbSchema(updatedHabitData, {user: user.id, partner: user.partnerId!})
   await habitDb.findByIdAndUpdate(id, toDbUpdate)

    res.status(StatusCodes.OK).json({message:"habit updated"})
}