import {Request, Response} from "express";
import {CreateHabit} from "../../../../types/habit";
import {habitDb} from "../../../models/habits/habit.model";
import {habitConverter} from "../../../lib/habits/habitConverter";
import {StatusCodes} from "http-status-codes";
import {
    validateGlobalStrikeWhileAdding
} from "./helpers/validateGlobalStrikeWhileAdding/validateGlobalStrikeWhileAdding";

export const createHabit = async (req:Request, res:Response) => {
    const newHabitData = req.body as CreateHabit
    const {partner, user} = res.locals

    const convertedHabit = habitConverter.fromFrontendHabitToDbSchema(newHabitData, {user: user.id, partner: partner!.id})

    //if the habit is scheduled for today and all habits scheduled for today have been completed, decrease today's strike and points
    await validateGlobalStrikeWhileAdding(convertedHabit, user)

    await habitDb.create(convertedHabit)

    res.status(StatusCodes.CREATED).json({message:"habit created"})
}