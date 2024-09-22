import {Router} from 'express';
import {getUser} from "../../controllers/users/users.controller";

export const userRouter = Router()

userRouter.get("/", getUser)