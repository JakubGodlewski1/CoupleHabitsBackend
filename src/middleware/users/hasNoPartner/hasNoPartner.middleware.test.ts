import {describe, expect} from "vitest";
import {Request, Response} from "express";
import {hasNoPartner} from "./hasNoPartner.middleware.js";
import {UserDbSchema} from "../../../../types/user.js";

describe("hasNoPartner middleware", () => {
    const user = {partnerId: "654321"} as UserDbSchema
    const req = {} as Request
    const res = {locals:{user}} as Response
    const next = vi.fn()

    it('should throw an error if user already has a partner', () => {
        res.locals.user.partnerId = "654321"

        expect(()=>hasNoPartner(req, res, next))
            .toThrowError("already have a partner")
    });

    it('should call next if user does not have a partner', () => {
        res.locals.user.partnerId = null
        hasNoPartner(req, res, next)
        expect(next).toHaveBeenCalled()

    });
})