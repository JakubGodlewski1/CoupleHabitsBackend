import {Request, Response, Router} from "express";
import {withTransaction} from "../../../lib/mongo/withTransaction";
import {userDb} from "../../../models/users/user.model";
import {gameAccountDb} from "../../../models/gameAccounts/gameAccount.model";
import {habitDb} from "../../../models/habits/habit.model";
import {StatusCodes} from "http-status-codes";

export const cleanUpRouter =  Router();

cleanUpRouter.get("/",  async (req:Request, res:Response)=>{
    if (process.env.NODE_ENV === "production") {
        return res.status(StatusCodes.FORBIDDEN).json({message:"action forbidden"})
    }

    /*delete game account, habits, user account and partner account*/

    const user = res.locals.user

    await withTransaction( async (session)=>{
        //delete game account
        await gameAccountDb.findByIdAndDelete(user.gameAccountId)

        //delete all habits related to the user
        await habitDb.deleteMany({"details.userId":user.id})

        //delete partner and user
        await userDb.deleteMany({ id: { $in: [user.id, user.partnerId]}});
    })

    res.status(200).send({message:"success"})
})