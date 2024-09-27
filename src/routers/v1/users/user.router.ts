import {Router} from 'express';
import {getUser} from "../../../controllers/users/getUser/getUser.controller";
import {connectWithPartnerController} from "../../../controllers/users/connectWithPartner/connectWithPartner.controller";
import {hasNoPartner} from "../../../middleware/users/hasNoPartner/hasNoPartner.middleware";
import {hasConnectionCodeAndCurrentDate} from "../../../middleware/users/hasConnectionCodeAndCurrentDate/hasConnectionCodeAndCurrentDate.middleware";
import {partnerExists} from "../../../middleware/users/partnerExists/partnerExists.middleware";

export const userRouter = Router()

userRouter.get("/", getUser)
userRouter.post("/connect-with-partner", hasNoPartner, hasConnectionCodeAndCurrentDate, partnerExists, connectWithPartnerController)