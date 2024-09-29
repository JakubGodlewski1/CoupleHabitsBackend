import mongoose from "mongoose";

type GameAccountDbSchema = {
    utcOffset: number;
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    strike: number;
    points: number,
}

