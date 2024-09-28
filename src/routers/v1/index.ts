import Router from "express"
import {userRouter} from "./users/user.router";
import {habitsRouter} from "./habits/habits.router";
import {hasPartner} from "../../middleware/users/hasPartner/hasPartner.middleware";
import {ClerkExpressRequireAuth} from "@clerk/clerk-sdk-node";
import {handleUserExists} from "../../middleware/users/handleUserExists/handleUserExists.middleware";
import {cleanUpRouter} from "./testCleanUp/testCleanUp.router";

export const routerV1 = Router()

routerV1.use(ClerkExpressRequireAuth(), handleUserExists)

routerV1.use("/users", userRouter)
routerV1.use("/habits", hasPartner, habitsRouter)
routerV1.use("/clean-up", cleanUpRouter)


