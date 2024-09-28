import {Router} from 'express';
import {createHabit} from "../../../controllers/habits/createHabit/createHabit.controller";
import {validateCreateHabitBody} from "../../../middleware/habits/createHabit/createHabit.middleware";
import {deleteHabit} from "../../../controllers/habits/deleteHabit/deleteHabit.controller";
import {validateHabitId} from "../../../middleware/habits/validateHabitId/validateHabitId.middleware";

export const habitsRouter = Router();

habitsRouter.post("/", validateCreateHabitBody, createHabit)
habitsRouter.delete("/:id", validateHabitId, deleteHabit)