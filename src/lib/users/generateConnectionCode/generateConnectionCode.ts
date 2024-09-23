import { randomStringGenerator } from "../../../utils/randomStringGenerator/randomStringGenerator";
import { userDb } from "../../../models/users/user.model";
import {UserDbSchema} from "../../../../types/user";

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