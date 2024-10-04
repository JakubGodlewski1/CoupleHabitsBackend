import {Router} from 'express';
import {dayOff} from "../../../controllers/dayOff/dayOff.controller";
import {validateDayOff} from "../../../middleware/dayOff/dayOff.middleware";

export const dayOffRouter = Router()

dayOffRouter.get("/", validateDayOff, dayOff)