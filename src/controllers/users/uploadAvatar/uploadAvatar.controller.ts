import {Request, Response} from 'express';
import {uploadImage} from "./s3";
import {StatusCodes} from "http-status-codes";

export const uploadAvatar =async (req:Request, res:Response) =>{
    await uploadImage(req, res.locals.user)

    res.status(StatusCodes.OK).json({message:"avatar updated"})
}