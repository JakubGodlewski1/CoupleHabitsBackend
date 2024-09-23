import Router from "express"
import {userRouter} from "./users/user.router";
import {cleanUpRouter} from "../testCleanUps/router.cleanup";

export const routerV1 = Router()

routerV1.use("/users", userRouter)

//test clean up
routerV1.use("/clean-up", cleanUpRouter)