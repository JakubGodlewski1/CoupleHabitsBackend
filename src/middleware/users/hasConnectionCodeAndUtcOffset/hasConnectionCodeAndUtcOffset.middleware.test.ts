import {beforeEach, describe, expect, it} from "vitest";
import {NextFunction, Request, Response} from "express";
import {hasConnectionCodeAndUtcOffset} from "./hasConnectionCodeAndUtcOffset.middleware.js";

describe("hasConnectionCodeAndUtcOffset", () => {
    const user = {
        connectionCode: "123456"
    }

        let req = {
            body:{
                connectionCode: "654321",
                utcOffset: 10
            }
        } as Request
        let res = {locals:{user}} as Response
        const next = vi.fn() as NextFunction;

        beforeEach(()=>{
                req.body= {
                    connectionCode: "654321",
                    utcOffset: 10
                }
        })

    /*connection code*/

    it("should throw a BadRequestError if connection code is missing", () => {
        req.body.connectionCode = undefined as any

        // Invoke the middleware and expect it to throw an error
        expect(() => hasConnectionCodeAndUtcOffset(req as Request, res as Response, next))
            .toThrowError("Connection code is missing");
    });

    it("should throw a BadRequestError if connection code is not 6 characters long", () => {
        req.body.connectionCode= "ABC" // Less than 6 characters

        // Invoke the middleware and expect it to throw an error
        expect(() => hasConnectionCodeAndUtcOffset(req as Request, res as Response, next))
            .toThrowError("Connection code should be 6 characters long");
    });

    it("should throw a BadRequestError if connection code contains invalid characters", () => {
        req.body.connectionCode = "ABC$12" // Invalid character '$'

        // Invoke the middleware and expect it to throw an error
        expect(() => hasConnectionCodeAndUtcOffset(req as Request, res as Response, next))
            .toThrowError("Connection code contains invalid characters");
    });

    it("should call next if a valid connection code is provided", () => {
        hasConnectionCodeAndUtcOffset(req as Request, res as Response, next);

        // Expect next to have been called (no error)
        expect(next).toHaveBeenCalled();
    });

    it('should throw error if user passes their own code', () => {
        req.body.connectionCode = user.connectionCode

        expect(() => hasConnectionCodeAndUtcOffset(req as Request, res as Response, next)).toThrowError(/your own connection code/)
    });

    it('should throw error if no utc offset is provided', () => {
        req.body= {
            connectionCode: "654321"
        }
        expect(() => hasConnectionCodeAndUtcOffset(req as Request, res as Response, next)).toThrowError(/utc offset is missing/i)
    });

    it('should throw error if utc offset is outside of range (-12 to 14)', () => {
        req.body= {connectionCode: "654321", utcOffset: 15}
        expect(() => hasConnectionCodeAndUtcOffset(req as Request, res as Response, next)).toThrowError(/UTC offset has to be between -12 and 14/i)
        req.body= {connectionCode: "654321", utcOffset: -13}
        expect(() => hasConnectionCodeAndUtcOffset(req as Request, res as Response, next)).toThrowError(/UTC offset has to be between -12 and 14/i)
    });
})