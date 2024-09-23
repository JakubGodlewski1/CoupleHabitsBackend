import {UserDbSchema} from "../../types/user";
import {NextFunction, Request, Response} from "express";

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

const partner = {
    updatedAt: new Date(),
    createdAt: new Date(),
    id: "54321",
    avatar: "https://example.com/avatarPartner.jpg",
    partnerId: "12345",
    connectionCode: "ABCDEF",
    gameAccountId: null,
    email: "partner@example.com"
} as UserDbSchema

const req = {
    auth:{
        userId: "12345",
        email: "test@test.com",
    }
} as Request

const res = {
    status: vi.fn((code:number)=>({
        json: vi.fn((payload:any)=>{})
    })),

    locals:{
        user,
        partner
    }
} as unknown as Response

const next = vi.fn() as NextFunction

export const testData = {
    res,
    req,
    user,
    partner,
    next
}