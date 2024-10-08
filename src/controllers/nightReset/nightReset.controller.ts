import {Request, Response} from "express";
import {getDayBasedOnUtcOffset} from "../../utils/getDayBasedOnUtcOffset/getDayBasedOnUtcOffset.js";
import {NightResetAccount} from "../../../types/nightValidation.js";
import {gameAccountDb} from "../../models/gameAccounts/gameAccount.model.js";
import {GameAccountDbSchema} from "../../../types/gameAccount.js";
import {habitDb} from "../../models/habits/habit.model.js";
import {HabitDbSchema} from "../../../types/habit.js";
import {userDb} from "../../models/users/user.model.js";
import {habitFilters} from "../../utils/habitFilters/habitFilters.js";
import {withTransaction} from "../../lib/mongo/withTransaction.js";
import {StatusCodes} from "http-status-codes";
import {getUniqueUsers} from "./helpers/helpers.js";
import {UserDbSchema} from "../../../types/user.js";

export const nightReset = async (req:Request, res:Response) => {
    //calculate utc offset/s of people who currently have midnight
    const offsets =  getMidnightOffsets()

    //fetch all gameAccounts that currently has midnight
    const gameAccounts:GameAccountDbSchema[] = await gameAccountDb.find({utcOffset:{$in:offsets}})
    const gameAccountIds = gameAccounts.map(g=>g._id)

    //fetch all users who have the given game account
    const users:UserDbSchema[] = await userDb.find({gameAccountId:{$in:gameAccountIds}})

    //remove duplicate accounts (2 people have the same game account)
    const uniqueUsers = getUniqueUsers(users)
    const uniqueUserIds:string[] = uniqueUsers.map(u=>u.id)

    //fetch all habits related to the users
    const allHabits:HabitDbSchema[] = await habitDb.find({"details.userId":{$in:uniqueUserIds}})

    //create array of night-reset accounts for validation
    let nightResetAccounts:NightResetAccount[] = []
    uniqueUsers.forEach(user=>{

        const gameAccount = gameAccounts.find(ga=> ga._id.equals(user.gameAccountId)
        )
        const habits = allHabits.filter(h=>h.details.some(d=>d.userId===user.id))

        nightResetAccounts.push({
            id: gameAccount!._id,
            utcOffset:gameAccount!.utcOffset,
            habits,
        })
    })

    for (const {utcOffset, habits, id} of nightResetAccounts) {
        const today = getDayBasedOnUtcOffset(utcOffset).day
        const yesterday = today > 0 ? today -1 : 6

        //validate that all habits have been completed yesterday
        const habitsScheduledForYesterday = habitFilters.scheduledFor(yesterday, habits)
        const areAllCompleted = habitFilters.validators.areAllCompleted(habitsScheduledForYesterday)
        //reset global strike and reset local strikes of habits that have not been completed
        if (!areAllCompleted) {
            //get ids of all habits that should be reset
            const undoneHabitIds = habitsScheduledForYesterday
                .filter(h=> !h.details.every((d:any)=>d.completed))
                .map(h=>h._id)

            await withTransaction(async (session)=>{
                    await habitDb.updateMany({_id:{$in:undoneHabitIds}}, {strike:0}, {session})
                    await gameAccountDb.findByIdAndUpdate(id, {strike:0}, {session})
            })
        }

        //set all habits to undone
       await habitDb.updateMany({_id: {$in: habitsScheduledForYesterday.map(h=>h._id)}}, { $set: { "details.$[].completed": false }})
    }

    res.status(StatusCodes.OK).json({message:"success"})
}

export const getMidnightOffsets =  () => {
    //utc offset is max 14 and min -12
    const currentUtcHour = getDayBasedOnUtcOffset(0).hour

    if (currentUtcHour<10)
        return [-currentUtcHour]

    if(currentUtcHour>12)
        return [24-currentUtcHour]

    else return [-currentUtcHour, 24-currentUtcHour]
}