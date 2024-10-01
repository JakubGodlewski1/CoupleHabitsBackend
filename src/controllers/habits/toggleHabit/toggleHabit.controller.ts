import {Request, Response} from "express";
import {HabitDbSchema, ToggleHabit} from "../../../../types/habit";
import {habitDb} from "../../../models/habits/habit.model";
import {StatusCodes} from "http-status-codes";
import {getLocalStrikeIncrement} from "../helpers/getLocalStrikeIncrement/getLocalStrikeIncrement";
import {
    validateGlobalStrikeAndPoints
} from "../../../lib/gameAccount/validateGlobalStrikeAndPoints/validateGlobalStrikeAndPoints";

export const toggleHabit = async (req:Request, res:Response)=>{

    const {user} = res.locals
    const {isCompleted}:ToggleHabit = req.body
    const id = req.params.id

    const strikeIncrement = await getLocalStrikeIncrement(id, user, isCompleted)

    const habit:(HabitDbSchema | null) = await habitDb.findOneAndUpdate(
        { _id: id, 'details.userId': user.id },
        {
            $set: { 'details.$.completed': isCompleted },
            $inc: { strike: strikeIncrement }
        })

    if(strikeIncrement!==0 && habit){
        await validateGlobalStrikeAndPoints(user, isCompleted, habit)
    }

    res.status(StatusCodes.OK).json({message:"habit toggled"})
}