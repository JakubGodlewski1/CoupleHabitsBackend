import {habitDb} from "../../../models/habits/habit.model";
import {gameAccountDb} from "../../../models/gameAccounts/gameAccount.model";
import {UserDbSchema} from "../../../../types/user";
import {habitFilters} from "../../../utils/habitFilters/habitFilters";
import {GameAccountDbSchema} from "../../../../types/gameAccount";
import {manageGlobalStrike} from "../manageGlobalStrike/manageGlobalStrike";
import {getDayBasedOnUtcOffset} from "../../../utils/getDayBasedOnUtcOffset/getDayBasedOnUtcOffset";
import {HabitDbSchema} from "../../../../types/habit";
import _ from "lodash"

export const validateGlobalStrikeAndPoints = async (user: UserDbSchema, hasCompleted: boolean, {frequency}:HabitDbSchema) => {
    const gameAccount:(GameAccountDbSchema | null) = await gameAccountDb.findById(user.gameAccountId)

    //if today is not sunday and toggled habit is of type "weekly", return
    if(
        getDayBasedOnUtcOffset(gameAccount!.utcOffset) !== 0 &&
        _.isEqual(frequency, {type:"repeat", repeatOption:"weekly"})
    ) return

    const allHabits = await habitDb.find({"details.userId": user.id})

    //get all habits that are scheduled for today
    const habitsScheduledForToday = habitFilters.scheduledForToday(allHabits, getDayBasedOnUtcOffset(gameAccount!.utcOffset))

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