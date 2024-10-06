import {beforeEach, describe} from "vitest";
import {userDb} from "../../../models/users/user.model";
import {handleUserExists} from "./handleUserExists.middleware";
import {Request, Response} from "express";
import {UserDbSchema} from "../../../../types/user";

vi.mock("../../../models/users/user.model")

describe("handleUserExists", () => {
    const user = {
        updatedAt: new Date(),
        createdAt: new Date(),
        id: "12345",
        avatar: "https://example.com/avatar.jpg",
        partnerId: "54321",
        connectionCode: "123456",
        gameAccountId: null,
        email: "user@example.com"
    } as UserDbSchema

    let req = {auth:{userId:"123", sessionClaims: {email:"email"}}}as Request
    let res = {locals:{user}} as Response
    const next = vi.fn()

    vi.mocked(userDb.create).mockResolvedValue(user as any)

    beforeEach(()=>{
        vi.clearAllMocks()
    })


    it('should create a new user in db if it does not exist', async () => {
        //there is no user in db
        vi.mocked(userDb.findOne).mockResolvedValueOnce(null)
        await handleUserExists(req, res, next)
        expect(userDb.create).toHaveBeenCalled()
        expect(res.locals.user).toMatchObject(user)
    });


    it('should not create a user  if the user already exists in db', async () => {
        //there is user in db
        vi.mocked(userDb.findOne).mockResolvedValueOnce(user)
        await handleUserExists(req, res, next)
        expect(userDb.create).not.toHaveBeenCalled()
        expect(res.locals.user).toMatchObject(user)
    });
})