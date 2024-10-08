import { randomStringGenerator } from "../../../utils/randomStringGenerator/randomStringGenerator.js";
import { userDb } from "../../../models/users/user.model.js";
import {UserDbSchema} from "../../../../types/user.js";

// Assuming your user model has a connectionCode field, we can add appropriate types
export const generateConnectionCode = async (): Promise<string> => {
    let connectionCode: string;
    let codeExists: UserDbSchema | null

    do {
        connectionCode = randomStringGenerator(6);
        codeExists = await userDb.findOne({ connectionCode });
    } while (codeExists);

    return connectionCode;
}