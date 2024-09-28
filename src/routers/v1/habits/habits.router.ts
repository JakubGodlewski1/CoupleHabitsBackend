import {Router} from 'express';
import {createHabit} from "../../../controllers/habits/createHabit/createHabit.controller";
import {validateCreateHabitBody} from "../../../middleware/habits/createHabit/createHabit.middleware";
import {deleteHabit} from "../../../controllers/habits/deleteHabit/deleteHabit.controller";
import {validateHabitId} from "../../../middleware/habits/validateHabitId/validateHabitId.middleware";
import {updateHabit} from "../../../controllers/habits/updateHabit/updateHabit.controller";
import {validateUpdateHabitBody} from "../../../middleware/habits/updateHabit/updateHabit.middleware";

export const habitsRouter = Router();

habitsRouter.post("/", validateCreateHabitBody, createHabit)
habitsRouter.delete("/:id", validateHabitId, deleteHabit)
habitsRouter.patch("/:id", validateHabitId, validateUpdateHabitBody, updateHabit)