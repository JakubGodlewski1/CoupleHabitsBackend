import mongoose from "mongoose";

type GameAccountDbSchema = {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    lastTimeCompleted: string,
    strike: number;
    points: number,
}

