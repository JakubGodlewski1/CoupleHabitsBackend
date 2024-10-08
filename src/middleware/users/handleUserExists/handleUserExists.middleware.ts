import {NextFunction, Request, Response} from "express";
import {userDb} from "../../../models/users/user.model.js";

export const handleUserExists = async (req:Request, res:Response, next:NextFunction) => {
    //get user id from clerk auth
    const {userId, sessionClaims:{email}} = req.auth!

    //check if user exists
    let user = await userDb.findOne({id:userId})

    //if user does not exist, create a new entry in db
    if (!user){
        user = await userDb.create({id:userId, email})
    }

    //assign user to res.locals.user
    res.locals.user = user
    next()
}