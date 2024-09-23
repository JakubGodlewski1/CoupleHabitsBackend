import {beforeEach, describe, expect, it} from "vitest";
import {Request, Response} from "express";
import {hasConnectionCodeAndCurrentDate} from "./hasConnectionCodeAndCurrentDate.middleware";
import {testData} from "../../../utils/exampleDataForTests";

describe("hasConnectionCodeAndCurrentDate", () => {
    const {next, user, partner, } = testData

        const res = {
            locals:{
                user
            }
        }

        const req = {
            body:{
                lastTimeCompleted:"Mon Sep 23 2024 18:44:13 GMT+0100 (British Summer Time)",
                connectionCode: partner.connectionCode
            }
        }

        beforeEach(()=>{
            res.locals = {
                    user
                }
                req.body= {
                    lastTimeCompleted:"Mon Sep 23 2024 18:44:13 GMT+0100 (British Summer Time)",
                    connectionCode: partner.connectionCode
                }
        })

    /*connection code*/

    it("should throw a BadRequestError if connection code is missing", () => {
        req.body.connectionCode = undefined as any

        // Invoke the middleware and expect it to throw an error
        expect(() => hasConnectionCodeAndCurrentDate(req as Request, res as Response, next))
            .toThrowError("Connection code is missing");
    });

    it("should throw a BadRequestError if connection code is not 6 characters long", () => {
        req.body.connectionCode= "ABC" // Less than 6 characters

        // Invoke the middleware and expect it to throw an error
        expect(() => hasConnectionCodeAndCurrentDate(req as Request, res as Response, next))
            .toThrowError("Connection code should be 6 characters long");
    });

    it("should throw a BadRequestError if connection code contains invalid characters", () => {
        req.body.connectionCode = "ABC$12" // Invalid character '$'

        // Invoke the middleware and expect it to throw an error
        expect(() => hasConnectionCodeAndCurrentDate(req as Request, res as Response, next))
            .toThrowError("Connection code contains invalid characters");
    });

    it("should call next if a valid connection code is provided", () => {
        hasConnectionCodeAndCurrentDate(req as Request, res as Response, next);

        // Expect next to have been called (no error)
        expect(next).toHaveBeenCalled();
    });

    it('should throw error if user passes their own code', () => {
        req.body.connectionCode = user.connectionCode

        expect(() => hasConnectionCodeAndCurrentDate(req as Request, res as Response, next)).toThrowError(/your own connection code/)
    });

    /*lastTimeCompleted*/
    it('should throw error if last time completed has not been passed', () => {
        req.body.lastTimeCompleted = undefined as any
        expect(() => hasConnectionCodeAndCurrentDate(req as Request, res as Response, next)).toThrowError(/lastTimeCompleted is missing/i)
    });

    it('should throw error if connection code is not a date in string format', () => {
       req.body.lastTimeCompleted = "1234"
        expect(()=>hasConnectionCodeAndCurrentDate(req as Request, res as Response, next)).toThrowError(/is not a valid date/)
    });
})



