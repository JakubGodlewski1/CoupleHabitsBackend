import Router from "express"
import {userRouter} from "./users/user.router";
import {habitsRouter} from "./habits/habits.router";
import {hasPartner} from "../../middleware/users/hasPartner/hasPartner.middleware";
import {ClerkExpressRequireAuth} from "@clerk/clerk-sdk-node";
import {handleUserExists} from "../../middleware/users/handleUserExists/handleUserExists.middleware";
import {cleanUpRouter} from "./testCleanUp/testCleanUp.router";
import {setMockDateForTests} from "../../middleware/habits/setMockDateForTests";
import {nightReset} from "../../controllers/nightReset/nightReset.controller";

export const routerV1 = Router()

routerV1.use(ClerkExpressRequireAuth(), setMockDateForTests, handleUserExists)

routerV1.use("/users", userRouter)
routerV1.use("/habits", hasPartner, habitsRouter)
routerV1.use("/night-reset", nightReset)
routerV1.use("/clean-up", cleanUpRouter)


