import {userDb} from "../../../models/users/user.model.js";
import {UserDbSchema} from "../../../../types/user.js";
import {habitDb} from "../../../models/habits/habit.model.js";
import {HabitDbSchema} from "../../../../types/habit.js";
import {habitConverter} from "../../habits/habitConverter.js";
import {gameAccountDb} from "../../../models/gameAccounts/gameAccount.model.js";
import mongoose from "mongoose";
import {GameAccountDbSchema} from "../../../../types/gameAccount.js";
import {InternalError} from "../../../errors/customErrors.js";

export const getPartnerAvatar = async (partnerId:string | null):Promise<null | string> => {
    if (!partnerId) return null
    const partner = await userDb.findOne({id:partnerId}) as UserDbSchema
    return partner.avatar || null
}

export const getHabits = async (userId:string, partnerId:string) => {
    const habits = await habitDb.find({
        details: {
            $elemMatch: {
                userId: { $in: [userId, partnerId] }
            }
        }
    }) as HabitDbSchema[] || []

    return habits.map((habit:HabitDbSchema)=>habitConverter.fromDbHabitSchemaToFrontendHabit({habit, userId}))
}

export const getGameAccount = async (gameAccountId:mongoose.Types.ObjectId):Promise<{points:number, strike:number, dayOffPrice: number}> => {
    const gameAccount = await gameAccountDb.findOne({_id:gameAccountId}) as GameAccountDbSchema | null
        if (!gameAccount) {
            throw new InternalError("We could not find your game account")
        }

        return {
            points:gameAccount.points,
            strike:gameAccount.strike,
            dayOffPrice: gameAccount.dayOffPrice
        }
}