import {beforeEach, describe, expect} from "vitest";
import {generateUserPayload} from "./generateUserPayload";
import {UserDbSchema} from "../../../../types/user";
import mongoose from "mongoose";
import {getGameAccount, getHabits, getPartnerAvatar} from "./helpers";
import {FrontendHabit} from "../../../../types/habit";

vi.mock("./helpers")

describe("generateUserPayload", () => {
    let user = {
        id: "12345",
        gameAccountId:new mongoose.Types.ObjectId("64b1f03fa9d1a0f12c000abc"),
        avatar:null,
        partnerId:"54321",
        connectionCode:"123456",
        email:"user@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
    } as UserDbSchema

    beforeEach(()=>{
        user = {
            id: "12345",
            gameAccountId:new mongoose.Types.ObjectId("64b1f03fa9d1a0f12c000abc"),
            avatar:null,
            partnerId:"54321",
            connectionCode:"123456",
            email:"user@example.com",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as UserDbSchema
    })

    it(`should return user payload with 
    - partner.id = null,
    - partner.avatar = null,
    -gameAccount = {strike:0, points:0},
    -habits=[] 
    if user.partnerId does not exist and user.gameAccountId does not exist`, async () => {

        user.partnerId = null
        user.gameAccountId = null
        const userPayload = await generateUserPayload(user)
        expect(userPayload).toMatchObject({
            partner:{
                connected:false,
                avatar:null,
            },
            gameAccount:{
                points:0,
                strike:0
            },
            habits:[]
        })
    });

    it('should return values from helper functions if both user.partnerId and user.gameAccountId exist', async () => {
        const avatarUrl = "http://exampleAvatarUrl.com/123"
        const habits = [{id:"1"}, {id:"2"}] as unknown as FrontendHabit[]
        const gameAccount = {points:2, strike:1}

        vi.mocked(getPartnerAvatar).mockResolvedValue(avatarUrl)
        vi.mocked(getHabits).mockResolvedValue(habits)
        vi.mocked(getGameAccount).mockResolvedValue(gameAccount)

        const userPayload = await generateUserPayload(user)
        expect(userPayload).toMatchObject({
            habits,
            partner:{
                avatar:avatarUrl
            },
            gameAccount
        })
    });
})