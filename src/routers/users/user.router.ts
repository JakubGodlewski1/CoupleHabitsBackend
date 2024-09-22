import {Router} from 'express';
import {getUser} from "../../controllers/users/getUser/getUser.controller";

export const userRouter = Router()

userRouter.get("/", getUser)
userRouter.post("/connect-with-partner")