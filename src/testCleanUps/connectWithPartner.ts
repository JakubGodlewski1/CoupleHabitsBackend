import {Request, Response} from "express";
import {userDb} from "../models/users/user.model";
import {UserDbSchema} from "../../types/user";
import {withTransaction} from "../lib/mongo/withTransaction";
import {gameAccountDb} from "../models/gameAccounts/gameAccount.model";

export const connectWithPartnerCleanUp = async (req:Request, res:Response) => {
    const {userId} = req.auth!

    await withTransaction( async (session)=>{
        //reset partner id on user account
        const user:UserDbSchema | null  = await userDb.findOne({id:userId})

        await userDb.updateOne({id: userId}, {partnerId: null, gameAccountId: null}, {session})
        console.log(user)
        //reset partner id on partner account
         await userDb.updateOne({id: user?.partnerId}, {partnerId: null, gameAccountId: null}, {session})
        //delete game account
        await gameAccountDb.deleteOne({_id: user?.gameAccountId})
    })

    res.status(200).send({message:"success"})
}