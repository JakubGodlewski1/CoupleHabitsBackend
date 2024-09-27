import {z} from "zod";
import {createHabitValidator, frequencyValidator} from "../src/validators/habit.validator";
import mongoose from "mongoose";

type CreateHabit = z.infer<typeof createHabitValidator>

type Frequency = z.infer<typeof frequencyValidator>
type HabitDbSchema = {
    _id: mongoose.Types.ObjectId;
    createdAt: Date,
    updatedAt: Date,
    frequency: Frequency
    details: [
        {
            userId: string,
            label: string,
            completed: boolean
        },
        {
            userId: string,
            label: string,
            completed: boolean
        }
    ],
    strike: number,
    lastTimeCompleted: string | null
}

type HabitDbSchemaCreate = {
    frequency: Frequency
    details: [
        {
            userId: string,
            label: string,
            completed: boolean
        },
        {
            userId: string,
            label: string,
            completed: boolean
        }
    ],
    strike?: number,
    lastTimeCompleted?: string | null
}


type FrontendHabit = {
    strike: number,
    frequency: Frequency
    details: {
        mine:{
            label: string,
            completed:boolean
        },
        partner:{
            label: string,
            completed:boolean
        }
    }
}

