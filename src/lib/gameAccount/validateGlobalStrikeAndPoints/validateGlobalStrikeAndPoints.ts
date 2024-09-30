import {habitDb} from "../../../models/habits/habit.model";
import {gameAccountDb} from "../../../models/gameAccounts/gameAccount.model";
import {UserDbSchema} from "../../../../types/user";
import {habitFilters} from "../../../utils/habitFilters/habitFilters";
import {GameAccountDbSchema} from "../../../../types/gameAccount";
import {manageGlobalStrike} from "../manageGlobalStrike/manageGlobalStrike";
import {getDayBasedOnUtcOffset} from "../../../utils/getDayBasedOnUtcOffset/getDayBasedOnUtcOffset";

export const validateGlobalStrikeAndPoints = async (user: UserDbSchema, hasCompleted: boolean) => {
    const allHabits = await habitDb.find({"details.userId": user.id})
    const gameAccount:(GameAccountDbSchema | null) = await gameAccountDb.findById(user.gameAccountId)

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