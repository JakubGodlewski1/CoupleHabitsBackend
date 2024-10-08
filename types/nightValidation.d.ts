import mongoose from "mongoose";
import {HabitDbSchema} from "./habit.js";

type NightResetAccount = {
    id: mongoose.Types.ObjectId,
    utcOffset: number,
    habits:HabitDbSchema[]
}