import {userDb} from "../../../models/users/user.model";
import {UserDbSchema} from "../../../../types/user";
import {habitDb} from "../../../models/habits/habit.model";
import {HabitDbSchema} from "../../../../types/habit";
import {habitConverter} from "../../habits/habitConverter";
import {gameAccountDb} from "../../../models/gameAccounts/gameAccount.model";
import mongoose from "mongoose";
import {GameAccountDbSchema} from "../../../../types/gameAccount";
import {InternalError} from "../../../errors/customErrors";

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

export const getGameAccount = async (gameAccountId:mongoose.Types.ObjectId):Promise<{points:number, strike:number}> => {
    const gameAccount = await gameAccountDb.findOne({_id:gameAccountId}) as GameAccountDbSchema | null
        if (!gameAccount) {
            throw new InternalError("We could not find your game account")
        }

        return {
            points:gameAccount.points,
            strike:gameAccount.strike
        }
}