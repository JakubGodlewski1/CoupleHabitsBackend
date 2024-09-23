import mongoose from "mongoose";

//mongo db user schema
type UserDbSchema = {
    updatedAt: Date;
    createdAt: Date
    avatar: string,
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
    habits: [],
    gameAccount: {
        strike: number,
        points: number
    }
}