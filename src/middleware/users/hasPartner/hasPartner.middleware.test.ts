import {describe, expect} from "vitest";
import {testData} from "../../../utils/exampleDataForTests";
import {hasPartner} from "./hasPartner.middleware";
import {userDb} from "../../../models/users/user.model";

vi.mock("../../../models/users/user.model");

describe("hasPartner middleware", () => {
    let req: any;
    let res: any;
    let next: any;
    let user: any;

    beforeEach(() => {
        req = { ...testData.req };
        res = { ...testData.res };
        next = testData.next;
        user = { ...testData.user };
        res.locals = { user };
    });

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