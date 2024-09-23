import {describe, expect} from "vitest";
import {testData} from "../../../utils/exampleDataForTests";
import {Response} from "express";
import {hasNoPartner} from "./hasNoPartner.middleware";

describe("hasNoPartner middleware", () => {
    const resWithPartnerId = {
        locals: {
            user: testData.user
        }
    } as Response

    const resWithoutPartnerId = {
        locals: {
            user: {...testData.user, partnerId: null}
        }
    } as Response

    it('should throw an error if user already has a partner', () => {
        expect(()=>hasNoPartner(testData.req, resWithPartnerId, vi.fn()))
            .toThrowError("already have a partner")
    });

    it('should call next if user does not have a partner', () => {
        const next = vi.fn()
        hasNoPartner(testData.req, resWithoutPartnerId, next)
        expect(next).toHaveBeenCalled()

    });
})