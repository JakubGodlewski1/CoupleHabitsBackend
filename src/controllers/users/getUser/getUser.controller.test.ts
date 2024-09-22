import {afterEach, describe} from "vitest";
import {userDb} from "../../../models/users/user.model";
import mongoose from "mongoose";
import {UserDbSchema} from "../../../../types/user";
import {getUser} from "./getUser.controller";
import {Request, Response} from "express";

vi.mock("../../../models/users/user.model")
vi.mock("../../../lib/users/generateUserPayload")

const exampleUser:UserDbSchema = {
    updatedAt: new Date(),
    createdAt: new Date(),
    _id: new mongoose.Types.ObjectId(),
    avatar: "https://example.com/avatar.jpg",
    partnerId: new mongoose.Types.ObjectId(),
    connectionCode: "12345ABC",
    gameAccountId: null,
    userId: "authProvider|unique123",
    email: "user@example.com"
};

describe("user controller", () => {
    const req = {auth:{userId: "123", email: "test@wp.pl"}} as Request;
    const res = {
        status: vi.fn((code:number)=>({
            json: vi.fn((payload:any)=>{})
        }))
    } as unknown as Response

    afterEach(()=>{
        vi.clearAllMocks()
    })

    it('should create a new user if no user exists in db', async () => {
       vi.mocked(userDb.findOne).mockResolvedValue(null)
       vi.mocked(userDb.create).mockResolvedValue(exampleUser as any)

      await getUser(req, res)

       expect(userDb.create).toHaveBeenCalled()
    });

    it('should not create a new user if the user exists in db',async () => {
        vi.mocked(userDb.findOne).mockResolvedValue(exampleUser)
        await getUser(req, res)

        expect(userDb.create).not.toHaveBeenCalled()
    });
})