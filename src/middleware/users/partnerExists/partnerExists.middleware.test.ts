import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userDb } from '../../../models/users/user.model.js';
import { BadRequestError } from '../../../errors/customErrors.js';
import {partnerExists} from "./partnerExists.middleware.js";

vi.mock('../../../models/users/user.model');

describe('partnerExists middleware', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        req = {
            body: {
                connectionCode: '123456',
            },
        };

        res = {
            locals: {},
        };

        next = vi.fn();
    });

    it('should call next and set partner in res.locals if partner exists', async () => {
        const mockPartner = { id: '123', name: 'Test Partner' };
        vi.mocked(userDb.findOne)
        .mockResolvedValue(mockPartner);

        await partnerExists(req, res, next);

        expect(userDb.findOne).toHaveBeenCalledWith({ connectionCode: '123456' });
        expect(res.locals.partner).toEqual(mockPartner);
        expect(next).toHaveBeenCalled();
    });

    it('should throw BadRequestError if partner does not exist', async () => {
       vi.mocked(userDb.findOne).mockResolvedValue(null);

        try {
            await partnerExists(req, res, next);
        } catch (error:any) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toMatch(/does not exist/);
            expect(next).not.toHaveBeenCalled();
        }

        expect(userDb.findOne).toHaveBeenCalledWith({ connectionCode: '123456' });
    });
});