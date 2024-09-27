import mongoose from "mongoose";
import {FrontendHabit} from "./habit";

//mongo db user schema
type UserDbSchema = {
    updatedAt: Date;
    createdAt: Date
    avatar: string | null,
    partnerId: string | null,
    connectionCode: string,
    gameAccountId: mongoose.Types.ObjectId | null
    id: string,
    email:string
}

type UserPayload = {
    avatar: null | string;
    partner: {
        connected: boolean,
        avatar: null | string;
    }
    connectionCode: string,
    email: string,
    habits: FrontendHabit[],
    gameAccount: {
        strike: number,
        points: number
    }
}