import {Router} from 'express';
import {getUser} from "../../controllers/users/users.controller";
import {containsGetUserData} from "../../middleware/users/users.middleware";

export const userRouter = Router()

userRouter.get("/", containsGetUserData, getUser)