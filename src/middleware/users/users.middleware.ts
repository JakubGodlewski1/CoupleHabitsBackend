import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {GetUser} from "../../../types/user";
import {StatusCodes} from "http-status-codes";

const containsGetUserDataValidator = z.object({
    email: z.string().email("Provided email is not correct, check it and try again"),
    authId: z.string({message:"The type of auth id is not correct. Type should be string"}).min(10, "User id is too short"),
})

export const containsGetUserData = (req:Request, res: Response, next:NextFunction) => {
    const {success, error} = containsGetUserDataValidator.safeParse(req.body as GetUser)
    if (!success){
        console.log(error?.message)
        res.status(StatusCodes.BAD_REQUEST).json({message: error?.message})
    }
}