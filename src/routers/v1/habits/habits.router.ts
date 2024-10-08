import {Router} from 'express';
import {createHabit} from "../../../controllers/habits/createHabit/createHabit.controller.js";
import {validateCreateHabitBody} from "../../../middleware/habits/createHabit/createHabit.middleware.js";
import {deleteHabit} from "../../../controllers/habits/deleteHabit/deleteHabit.controller.js";
import {validateHabitId} from "../../../middleware/habits/validateHabitId/validateHabitId.middleware.js";
import {updateHabit} from "../../../controllers/habits/updateHabit/updateHabit.controller.js";
import {validateUpdateHabitBody} from "../../../middleware/habits/updateHabit/updateHabit.middleware.js";
import {validateToggleHabitBody} from "../../../middleware/habits/toggleHabit/toggleHabit.middleware.js";
import {toggleHabit} from "../../../controllers/habits/toggleHabit/toggleHabit.controller.js";

export const habitsRouter = Router();

habitsRouter.post("/", validateCreateHabitBody, createHabit)
habitsRouter.delete("/:id", validateHabitId, deleteHabit)
habitsRouter.patch("/:id", validateHabitId, validateUpdateHabitBody, updateHabit)
habitsRouter.patch("/:id/toggle", validateHabitId, validateToggleHabitBody, toggleHabit)
