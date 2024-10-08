import {HabitDbSchema, HabitDbSchemaCreate} from "../../../../../../types/habit.js";
import {habitDb} from "../../../../../models/habits/habit.model.js";
import {gameAccountDb} from "../../../../../models/gameAccounts/gameAccount.model.js";
import {UserDbSchema} from "../../../../../../types/user.js";
import {GameAccountDbSchema} from "../../../../../../types/gameAccount.js";
import {manageGlobalStrike} from "../../../../../lib/gameAccount/manageGlobalStrike/manageGlobalStrike.js";
import {getDayBasedOnUtcOffset} from "../../../../../utils/getDayBasedOnUtcOffset/getDayBasedOnUtcOffset.js";
import {habitFilters} from "../../../../../utils/habitFilters/habitFilters.js";

export const validateGlobalStrikeWhileAdding = async (habit:HabitDbSchemaCreate, user: UserDbSchema) => {
    const {scheduledFor, validators:{areAllCompleted}} = habitFilters;

    const gameAccount:(GameAccountDbSchema | null) = await gameAccountDb.findById(user.gameAccountId)
    if (!gameAccount) {
        throw new Error("We could not find your game account, please contact our support")
    }

    //validate that current habit is scheduled for today
    const today = getDayBasedOnUtcOffset(gameAccount.utcOffset).day
    const isScheduledForToday = scheduledFor(today, [habit as HabitDbSchema]).length !== 0
    if (!isScheduledForToday) {
        return
    }

    //validate that all habits scheduled for today have already been completed
    const habits = await habitDb.find({"details.userId":user.id})
    const habitsScheduledForToday = scheduledFor(today, habits)

    if (!areAllCompleted(habitsScheduledForToday) || habitsScheduledForToday.length === 0) {
        return
    }

    //decrease strike and points
    await manageGlobalStrike.decrementStrikeAndPoints(user.gameAccountId!)
}