import {GameAccountDbSchema} from "../../../../types/gameAccount";
import {gameAccountDb} from "../../../models/gameAccounts/gameAccount.model";
import mongoose from "mongoose";

export const manageGlobalStrike =  {
    incrementStrikeAndPoints: async (gameAccountId: mongoose.Types.ObjectId)=>{
        const gameAccount:(GameAccountDbSchema | null) = await gameAccountDb.findById(gameAccountId)
        const pointsToAdd = (gameAccount!.strike+1)*10
        await gameAccountDb.findByIdAndUpdate(gameAccountId, {$inc: {strike: 1, points:pointsToAdd}})
    },
    decrementStrikeAndPoints: async (gameAccountId: mongoose.Types.ObjectId)=>{
        const gameAccount:(GameAccountDbSchema | null) = await gameAccountDb.findById(gameAccountId)
        const pointsToDecrement = -gameAccount!.strike*10
        await gameAccountDb.findByIdAndUpdate(gameAccountId, {$inc: {strike: -1, points:pointsToDecrement}})
    }
}