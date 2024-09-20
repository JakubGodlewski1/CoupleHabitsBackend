import mongoose from "mongoose";

//mongo db user schema
type UserDbSchema = {
    updatedAt: Date;
    createdAt: Date
    _id: mongoose.Types.ObjectId
    avatar: string,
    partnerId: mongoose.Types.ObjectId | null,
    connectionCode: string,
    gameAccountId: mongoose.Types.ObjectId | null
} & GetUser

//content of body when user signs up or signs in
type GetUser = {
    authId: string,
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