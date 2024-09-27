import {beforeEach, describe, expect} from "vitest";
import {validateCreateHabitBody} from "./createHabit.middleware";
import {testData} from "../../utils/exampleDataForTests";
import {Request} from "express";

describe("validateCreateHabitBody", ()=>{
    const
        {
            res,
            next,
            exampleCreateHabitData,
            exampleCreateHabitDataIncorrect
        } = testData

    const req = {
        body: undefined
    } as Request

    it('should throw an error if a habit is missing something', () => {
        req.body = exampleCreateHabitDataIncorrect

        expect(()=>validateCreateHabitBody(req, res, next)).toThrowError(/is invalid/i)
    });


    it('should throw an error if no habit is provided', () => {
        req.body = undefined
        expect(()=>validateCreateHabitBody(req, res, next)).toThrowError(/you must provide a habit/i)
    });


    it('should not throw an error and call next if correct habit is provided', () => {
        const req = {
            body: exampleCreateHabitData
        } as Request
        validateCreateHabitBody(req, res, next)
        expect(next).toHaveBeenCalled()
    });
})