import {Request, Response} from "express";
import {CreateHabit} from "../../../../types/habit";
import {habitDb} from "../../../models/habits/habit.model";
import {habitConverter} from "../../../lib/habits/habitConverter";
import {StatusCodes} from "http-status-codes";

export const createHabit = async (req:Request, res:Response) => {
    const newHabitData = req.body as CreateHabit
    const {partner, user} = res.locals

    const convertedHabit = habitConverter.fromFrontendHabitToDbSchema(newHabitData, {user: user.id, partner: partner!.id})

    await habitDb.create(convertedHabit)

    res.status(StatusCodes.CREATED).json({message:"habit created"})
}