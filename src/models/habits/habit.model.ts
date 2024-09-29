import mongoose, { Schema} from "mongoose";
import {frequencyValidator} from "../../validators/habit.validator";
import {HabitDbSchema} from "../../../types/habit";

// Define the subdocument schema for details
const DetailSchema = new Schema({
    userId: { type: String, required: true },
    label: { type: String, required: true },
    completed: { type: Boolean, required: true , default: false},
}, { _id: false });

const HabitSchema= new Schema<HabitDbSchema>({
    frequency: {
        type: Schema.Types.Mixed,
        required: true,
        validate:{
            validator:(value:any)=>{
                const result = frequencyValidator.safeParse(value)
                return result.success
            }
        }
    },
    strike: {type: Number, default: 0, required: true},
    details: { type: [DetailSchema], required: true },
}, {timestamps: true});

export const habitDb = mongoose.model("Habit", HabitSchema);