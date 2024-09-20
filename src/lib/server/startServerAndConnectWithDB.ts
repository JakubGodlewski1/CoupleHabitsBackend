import {Express} from "express";
import mongoose from "mongoose";

export const startServerAndConnectWithDB = async (app:Express, PORT:number | string) => {
    try {
        await mongoose.connect(process.env.MONGO_URL!)
        // Handle initial connection errors
        mongoose.connection.on('error', (err) => {
            console.error('Initial MongoDB connection error:', err);
            throw new Error(err)
        });
        app.listen(PORT, () => {
            console.log("Server running on port: " + PORT);
        })
    } catch (err) {
        console.error(err)
        process.exit(1); // Exit the process with failure
    }
}