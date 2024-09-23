import mongoose, {Schema} from "mongoose";
import {GameAccountDbSchema} from "../../../types/gameAccount";

const GameAccountSchema: Schema = new Schema<GameAccountDbSchema>({
    lastTimeCompleted: {
        type: String,
        required: true,
    },
    strike: {
        type: Number,
        required: true,
        default: 0,
        validate:{
            validator: (val: number) => val >= 0
        }
    },
    points:{
        type: Number,
        required: true,
        default: 0,
        validate:{
            validator: (val: number) => val >= 0
        }
    }
}, {timestamps: true});

export const gameAccountDb = mongoose.model("GameAccount", GameAccountSchema);