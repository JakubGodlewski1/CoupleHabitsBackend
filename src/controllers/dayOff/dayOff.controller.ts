import {Request, Response} from "express";
import {UserDbSchema} from "../../../types/user";
import {HabitDbSchema} from "../../../types/habit";
import {GameAccountDbSchema} from "../../../types/gameAccount";
import {habitDb} from "../../models/habits/habit.model";
import {gameAccountDb} from "../../models/gameAccounts/gameAccount.model";

export const dayOff = async (req: Request, res: Response) => {
    //the values have been assigned in the validateDayOff middleware
    const {user, habitsScheduledForToday, gameAccount} = res.locals as {user:UserDbSchema, habitsScheduledForToday:HabitDbSchema[], gameAccount:GameAccountDbSchema}

    //set all habits as completed
    const habitIds = habitsScheduledForToday.map(h=>h._id)
    await habitDb.updateMany({_id: {$in: habitIds}}, { $set: { "details.$[].completed": true}})

    //subtract points from user and increase price for taking day off
    await gameAccountDb.findByIdAndUpdate(user.gameAccountId, {$inc:{
        points: -gameAccount.dayOffPrice,
        dayOffPrice: gameAccount.dayOffPrice
        }
    })

    res.status(200).json({})
}