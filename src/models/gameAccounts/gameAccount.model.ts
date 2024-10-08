import mongoose, {Schema} from "mongoose";
import {GameAccountDbSchema} from "../../../types/gameAccount.js";

const GameAccountSchema: Schema = new Schema<GameAccountDbSchema>({
    utcOffset: {
        required: true,
        type: Number,
        validate:{
            validator: (offset=> offset>=-12 && offset<=14),
            message:"UTC offset has to be between -12 and 14"
        }
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
    },
    dayOffPrice: {
        type: Number,
        required: true,
        default: 100,
        validate:{
            validator: (val: number) => val >= 0
        }

    }
}, {timestamps: true});

export const gameAccountDb = mongoose.model("GameAccount", GameAccountSchema);