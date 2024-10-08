import {describe, expect} from "vitest";
import {UserDbSchema} from "../../../../types/user.js";
import {getUniqueUsers} from "./helpers.js";

const userBase = {
    updatedAt: new Date(),
    createdAt: new Date(),
    connectionCode:"123456",
    email:"exampleEmail@example.com",
    avatar:"exampleUrl",
    partnerId:"321",
} as UserDbSchema;

describe("helpers", ()=>{
    it('GET UNIQUE USERS - should return unique users based on gameAccountId', () => {
        const exampleUsers = [
            {...userBase, gameAccountId:1 as any},
            {...userBase, gameAccountId:1 as any},
            {...userBase, gameAccountId:11 as any},
            {...userBase, gameAccountId:11 as any},
            {...userBase, gameAccountId:111 as any},
            {...userBase, gameAccountId:1111 as any},
            {...userBase, gameAccountId:11111 as any},
            {...userBase, gameAccountId:11111 as any},
        ] as UserDbSchema[]

        expect(getUniqueUsers(exampleUsers).length).toBe(5)

    });
})