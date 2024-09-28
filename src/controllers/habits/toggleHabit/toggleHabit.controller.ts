import {Request, Response} from "express";
import {ToggleHabit} from "../../../../types/habit";
import {habitDb} from "../../../models/habits/habit.model";
import {StatusCodes} from "http-status-codes";

export const toggleHabit = async (req:Request, res:Response)=>{
    const {user} = res.locals
    const {isCompleted}:ToggleHabit = req.body
    const id = req.params.id

    await habitDb.updateOne(
        { _id: id, 'details.userId': user.id },
        { $set: { 'details.$.completed': isCompleted } }
    );

    res.status(StatusCodes.OK).json({message:"habit toggled"})
}