import {Request, Response} from "express";
import {userDb} from "../../../models/users/user.model";
import {generateUserPayload} from "../../../lib/users/generateUserPayload/generateUserPayload";

export const getUser = async (req:Request, res: Response) => {
    const {user} = res.locals

    //Get the entire data that is needed at the frontend and return it
    const payload =await generateUserPayload(user)

    return res.status(200).json(payload)
}