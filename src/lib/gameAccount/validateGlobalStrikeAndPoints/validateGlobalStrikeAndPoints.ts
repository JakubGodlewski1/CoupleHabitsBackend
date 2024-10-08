import {habitDb} from "../../../models/habits/habit.model.js";
import {gameAccountDb} from "../../../models/gameAccounts/gameAccount.model.js";
import {UserDbSchema} from "../../../../types/user.js";
import {habitFilters} from "../../../utils/habitFilters/habitFilters.js";
import {GameAccountDbSchema} from "../../../../types/gameAccount.js";
import {manageGlobalStrike} from "../manageGlobalStrike/manageGlobalStrike.js";
import {getDayBasedOnUtcOffset} from "../../../utils/getDayBasedOnUtcOffset/getDayBasedOnUtcOffset.js";
import {HabitDbSchema} from "../../../../types/habit.js";
import _ from "lodash"

export const validateGlobalStrikeAndPoints = async (user: UserDbSchema, hasCompleted: boolean, {frequency}:HabitDbSchema) => {
    const gameAccount:(GameAccountDbSchema | null) = await gameAccountDb.findById(user.gameAccountId)

    //if today is not sunday and toggled habit is of type "weekly", return
    if(
        getDayBasedOnUtcOffset(gameAccount!.utcOffset).day !== 0 &&
        _.isEqual(frequency, {type:"repeat", repeatOption:"weekly"})
    ) return

    const allHabits = await habitDb.find({"details.userId": user.id})

    //get all habits that are scheduled for today
    const habitsScheduledForToday = habitFilters.scheduledFor(getDayBasedOnUtcOffset(gameAccount!.utcOffset).day, allHabits)

    if (habitsScheduledForToday.length === 0){
        return
    }

    //check if all habits has been completed, if so, increment global strike and add points
    if (habitFilters.validators.areAllCompleted(habitsScheduledForToday) && hasCompleted) {
        await manageGlobalStrike.incrementStrikeAndPoints(user.gameAccountId!)
    }

    //check if all habits were completed but user undone it. If yes, decrement global strike and subtract points
    if (habitFilters.validators.areAllCompletedButOneUserTask(habitsScheduledForToday, user.id) && !hasCompleted){
           await manageGlobalStrike.decrementStrikeAndPoints(user.gameAccountId!)
    }
}