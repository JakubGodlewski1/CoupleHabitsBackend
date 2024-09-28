import {z} from "zod";
import {createHabitValidator, frequencyValidator, toggleHabitValidator} from "../src/validators/habit.validator";
import mongoose from "mongoose";


type CreateHabit = z.infer<typeof createHabitValidator>
type UpdateHabit = CreateHabit

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
        user:{
            label: string,
            completed:boolean
        },
        partner:{
            label: string,
            completed:boolean
        }
    }
}

type ToggleHabit = z.infer<typeof toggleHabitValidator>
