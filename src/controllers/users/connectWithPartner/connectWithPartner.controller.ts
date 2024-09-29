import {Request, Response} from "express";
import {gameAccountDb} from "../../../models/gameAccounts/gameAccount.model";
import {withTransaction} from "../../../lib/mongo/withTransaction";
import {userDb} from "../../../models/users/user.model";
import {UserDbSchema} from "../../../../types/user";
import {GameAccountDbSchema} from "../../../../types/gameAccount";

export const connectWithPartnerController = async (req:Request, res:Response) => {
    const utcOffset = req.body.utcOffset

    //get partner and user (the partner has been fetched in middleware to validate if it exists)
    const partner = res.locals.partner as UserDbSchema
    const user = res.locals.user as UserDbSchema

    //assign partners to each other and add game account id to the accounts
    await withTransaction(async (session)=>{
        //create gameAccount
        const [gameAccount] = await gameAccountDb.create([{utcOffset}], {session}) as unknown as GameAccountDbSchema[]

        //add the game account id and my id to my partner's account
        await userDb.updateOne({id:partner.id}, {partnerId: user.id, gameAccountId: gameAccount._id}, {session})
        //add the game account id and partner id to my account
        await userDb.updateOne({id:user.id}, {partnerId:partner.id, gameAccountId: gameAccount._id}, {session})
    })

    res.status(200).json({message:"You have successfully connected with your partner!"});
}