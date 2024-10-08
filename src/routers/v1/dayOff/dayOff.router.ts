import {Router} from 'express';
import {dayOff} from "../../../controllers/dayOff/dayOff.controller.js";
import {validateDayOff} from "../../../middleware/dayOff/dayOff.middleware.js";

export const dayOffRouter = Router()

dayOffRouter.get("/", validateDayOff, dayOff)