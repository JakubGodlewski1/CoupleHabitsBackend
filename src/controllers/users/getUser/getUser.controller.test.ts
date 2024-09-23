import {afterEach, describe} from "vitest";
import {userDb} from "../../../models/users/user.model";
import mongoose from "mongoose";
import {UserDbSchema} from "../../../../types/user";
import {getUser} from "./getUser.controller";
import {Request, Response} from "express";
import {testData} from "../../../utils/exampleDataForTests";

vi.mock("../../../models/users/user.model")
vi.mock("../../../lib/users/generateUserPayload")

describe("user controller", () => {

    afterEach(()=>{
        vi.clearAllMocks()
    })

    const {req, res, user} = testData

    it('should create a new user if no user exists in db', async () => {
       vi.mocked(userDb.findOne).mockResolvedValue(null)
       vi.mocked(userDb.create).mockResolvedValue(user as any)

      await getUser(req, res)

       expect(userDb.create).toHaveBeenCalled()
    });

    it('should not create a new user if the user exists in db',async () => {
        vi.mocked(userDb.findOne).mockResolvedValue(user)
        await getUser(req, res)

        expect(userDb.create).not.toHaveBeenCalled()
    });
})