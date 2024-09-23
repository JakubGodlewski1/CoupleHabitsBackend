import {Router} from "express";
import {connectWithPartnerCleanUp} from "./connectWithPartner";

export const cleanUpRouter =  Router();
cleanUpRouter.get("/connect-with-partner", connectWithPartnerCleanUp)