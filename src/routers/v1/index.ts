import Router from "express"
import {userRouter} from "./users/user.router.js";
import {habitsRouter} from "./habits/habits.router.js";
import {hasPartner} from "../../middleware/users/hasPartner/hasPartner.middleware.js";
import {handleUserExists} from "../../middleware/users/handleUserExists/handleUserExists.middleware.js";
import {cleanUpRouter} from "./testCleanUp/testCleanUp.router.js";
import {setMockDateForTests} from "../../middleware/habits/setMockDateForTests.js";
import {nightReset} from "../../controllers/nightReset/nightReset.controller.js";
import {dayOffRouter} from "./dayOff/dayOff.router.js";
import {validateClerkToken} from "../../middleware/users/validateClerkToken.js";

export const routerV1 = Router()

routerV1.use(validateClerkToken(), setMockDateForTests, handleUserExists)

routerV1.use("/users", userRouter)
routerV1.use("/habits", hasPartner, habitsRouter)
routerV1.use("/night-reset", nightReset)
routerV1.use("/clean-up", cleanUpRouter)
routerV1.use("/day-off", dayOffRouter)