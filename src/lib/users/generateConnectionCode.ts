import { randomStringGenerator } from "../../utils/randomStringGenerator";
import { userDb } from "../../models/users/user.model";
import mongoose from "mongoose";


// Assuming your user model has a connectionCode field, we can add appropriate types
export const generateConnectionCode = async (): Promise<string> => {
    let connectionCode: string;
    let codeExists: { _id: mongoose.Types.ObjectId} | null

    do {
        connectionCode = randomStringGenerator(6);
        codeExists = await userDb.exists({ connectionCode });
    } while (codeExists);

    return connectionCode;
};
