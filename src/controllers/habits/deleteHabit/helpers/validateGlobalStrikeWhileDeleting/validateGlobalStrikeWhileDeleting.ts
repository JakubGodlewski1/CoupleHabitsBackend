import {HabitDbSchema} from "../../../../../../types/habit";
import {habitDb} from "../../../../../models/habits/habit.model";
import {habitFilters} from "../../../../../utils/habitFilters/habitFilters";
import {gameAccountDb} from "../../../../../models/gameAccounts/gameAccount.model";
import {UserDbSchema} from "../../../../../../types/user";
import {getDayBasedOnUtcOffset} from "../../../../../utils/getDayBasedOnUtcOffset/getDayBasedOnUtcOffset";
import {GameAccountDbSchema} from "../../../../../../types/gameAccount";
import {manageGlobalStrike} from "../../../../../lib/gameAccount/manageGlobalStrike/manageGlobalStrike";
import mongoose from "mongoose";

export const validateGlobalStrikeWhileRemoving = async (habitId:mongoose.Types.ObjectId, user: UserDbSchema) => {
    const {scheduledFor, validators:{areAllCompleted}} = habitFilters;

    const gameAccount:(GameAccountDbSchema | null) = await gameAccountDb.findById(user.gameAccountId)
    if (!gameAccount) {
        throw new Error("We could not find your game account, please contact our support")
    }

    //get habit that is being deleted
    const habit:(HabitDbSchema | null) = await habitDb.findById(habitId)
    if (!habit) {
        throw new Error("We could not find your habit, please try again later")
    }

    //validate that current habit is scheduled for today
    const today = getDayBasedOnUtcOffset(gameAccount.utcOffset).day
    const isScheduledForToday = scheduledFor(today, [habit]).length !== 0
    if (!isScheduledForToday) {
        return
    }

    //validate that the habit is not completed
    if (areAllCompleted([habit])){
        return
    }

    //validate that all habits scheduled for today have already been completed (excluding the current one)
    const habits = await habitDb.find({"details.userId":user.id})
    const habitsScheduledForToday = scheduledFor(today, habits) as HabitDbSchema[]

    const habitsScheduledForTodayExceptCurrent = habitsScheduledForToday.filter(h=> h._id.toString()!==habit._id.toString())

    if (!areAllCompleted(habitsScheduledForTodayExceptCurrent) || habitsScheduledForTodayExceptCurrent.length === 0) {
        return
    }

    //decrease strike and points
    await manageGlobalStrike.incrementStrikeAndPoints(user.gameAccountId!)
}