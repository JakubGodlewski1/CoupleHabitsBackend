import {Request, Response} from "express";
import {CreateHabit} from "../../../../types/habit";
import {habitDb} from "../../../models/habits/habit.model";
import {habitConverter} from "../../../lib/habits/habitConverter";

export const createHabit = async (req:Request, res:Response) => {
    const createHabitData = req.body as CreateHabit
    const {partner, user} = res.locals

    const convertedHabit = habitConverter.fromCreateHabitToDbSchemaCreate(createHabitData, {user: user.id, partner: partner!.id})

    await habitDb.create(convertedHabit)

    res.status(201).json({message:"habit created"})
}