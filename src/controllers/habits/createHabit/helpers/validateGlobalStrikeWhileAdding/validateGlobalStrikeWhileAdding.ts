import {HabitDbSchema, HabitDbSchemaCreate} from "../../../../../../types/habit";
import {habitDb} from "../../../../../models/habits/habit.model";
import {habitFilters} from "../../../../../utils/habitFilters/habitFilters";
import {gameAccountDb} from "../../../../../models/gameAccounts/gameAccount.model";
import {UserDbSchema} from "../../../../../../types/user";
import {getDayBasedOnUtcOffset} from "../../../../../utils/getDayBasedOnUtcOffset/getDayBasedOnUtcOffset";
import {GameAccountDbSchema} from "../../../../../../types/gameAccount";
import {manageGlobalStrike} from "../../../../../lib/gameAccount/manageGlobalStrike/manageGlobalStrike";

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