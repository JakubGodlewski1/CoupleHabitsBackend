import Router from "express"
import {userRouter} from "./users/user.router";
import {cleanUpRouter} from "../../testCleanUps/router.cleanup";
import {habitsRouter} from "./habits/habits.router";
import {hasPartner} from "../../middleware/users/hasPartner/hasPartner.middleware";
import {ClerkExpressRequireAuth} from "@clerk/clerk-sdk-node";
import {handleUserExists} from "../../middleware/users/handleUserExists/handleUserExists.middleware";

export const routerV1 = Router()

routerV1.use(ClerkExpressRequireAuth(), handleUserExists)

routerV1.use("/users", userRouter)
routerV1.use("/habits", hasPartner, habitsRouter)

//test clean up
routerV1.use("/clean-up", cleanUpRouter)