import {NextFunction, Request, Response} from "express";
import {gameAccountDb} from "../../models/gameAccounts/gameAccount.model.js";
import {GameAccountDbSchema} from "../../../types/gameAccount.js";
import {BadRequestError} from "../../errors/customErrors.js";
import {habitDb} from "../../models/habits/habit.model.js";
import {habitFilters} from "../../utils/habitFilters/habitFilters.js";
import {getDayBasedOnUtcOffset} from "../../utils/getDayBasedOnUtcOffset/getDayBasedOnUtcOffset.js";

export const validateDayOff = async (req:Request, res:Response, next:NextFunction) => {
    const {user} = res.locals
    const gameAccount:(GameAccountDbSchema | null) = await gameAccountDb.findById(user.gameAccountId)
    const habits = await habitDb.find({"details.userId":user.id})

    //game account exists
    if (!gameAccount) {
        throw new Error("We could not find your game account. Please contact our support team at help@couplehabits.com")
    }

    //validate that user have enough points to take day off
    if (gameAccount.dayOffPrice>gameAccount.points){
        throw new BadRequestError("You don't have enough points to take a day off")
    }

    //validate that user has not completed all tasks scheduled for today
    const habitsScheduledForToday = habitFilters.scheduledFor(getDayBasedOnUtcOffset(gameAccount.utcOffset).day, habits)
    const areAllCompleted = habitFilters.validators.areAllCompleted(habitsScheduledForToday)
    if (areAllCompleted){
        throw new Error("All your habits scheduled for today are completed. There is no reason to take a day off")
    }

    //assign data to res.locals to avoid refetch in controller
    res.locals.habitsScheduledForToday = habitsScheduledForToday
    res.locals.gameAccount = gameAccount

    next()
}