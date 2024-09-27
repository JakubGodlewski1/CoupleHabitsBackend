import {Router} from 'express';
import {createHabit} from "../../../controllers/habits/createHabit/createHabit.controller";
import {validateCreateHabitBody} from "../../../middleware/habits/createHabit.middleware";

export const habitsRouter = Router();

habitsRouter.post("/", validateCreateHabitBody, createHabit)