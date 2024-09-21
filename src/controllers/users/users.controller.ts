import {Request, Response} from "express";
import {userDb} from "../../models/users/user.model";
import {generateUserPayload} from "../../lib/users/generateUserPayload";
import {GetUser} from "../../../types/user";

export const getUser = async (req:Request, res: Response) => {
    //get getUser object
    const {authId, email} = req.body as GetUser

    //check if the user exists in db
    let user = await userDb.findOne({authId})

    //if user does not exist in db, create the user
    if (!user){
        user = await userDb.create({authId, email})
    }

    //Get the entire data that is needed at the frontend and return it
    const payload =await generateUserPayload(user)

    return res.status(200).json(payload)
}