import {describe, expect} from "vitest";
import {hasPartner} from "./hasPartner.middleware.js";
import {userDb} from "../../../models/users/user.model.js";
import {NextFunction, Request, Response} from "express";
import {UserDbSchema} from "../../../../types/user.js";

vi.mock("../../../models/users/user.model");

describe("hasPartner middleware", () => {
    const user = {partnerId:"654321"} as UserDbSchema

    const req = {} as Request
    const res = {locals:{user}} as Response
    const next = vi.fn() as NextFunction

    it('should throw an error if user does not have a partner', async () => {
        res.locals.user.partnerId = null;
        await expect(hasPartner(req, res, next)).rejects.toThrowError(/without a partner/i);
    });

    it('should throw an error if no user with given id was found in db', async () => {
        res.locals.user.partnerId = "54321";
        vi.mocked(userDb.findOne).mockResolvedValueOnce(null);
        await expect(hasPartner(req, res, next)).rejects.toThrowError(/id does not match/i);
    });

    it('should call next if partner exists', async () => {
        vi.mocked(userDb.findOne).mockResolvedValueOnce(user);
        await hasPartner(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});