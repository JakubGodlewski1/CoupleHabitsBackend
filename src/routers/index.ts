import Router from "express"
import {userRouter} from "./users/user.router";

export const routerV1 = Router()

routerV1.use("/users", userRouter)