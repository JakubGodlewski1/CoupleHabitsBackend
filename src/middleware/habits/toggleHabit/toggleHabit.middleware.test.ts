import {beforeEach, describe, expect} from "vitest";
import {NextFunction, Request, Response} from "express";
import {validateToggleHabitBody} from "./toggleHabit.middleware";

describe("validateToggleHabitBody", () => {
    let res = {} as Response
    let req = {} as Request
    let next = vi.fn() as NextFunction

    beforeEach(()=>{
        res = {} as Response
        req = {} as Request
        next = vi.fn() as NextFunction
    })

    it('should throw error if no req.body is provided', () => {
         expect(()=>validateToggleHabitBody(req, res, next)).toThrowError(/no data provided/i)
    });

    it('should throw an error if req.body is not of type toggleHabit', () => {
        req.body = {isCompleted:"true"}
        expect(()=>validateToggleHabitBody(req, res, next)).toThrowError(/is not valid/i)
    });

    it('should call next fn if provided req.body is correct', () => {
        req.body = {isCompleted:true}
        validateToggleHabitBody(req, res, next)
        expect(next).toHaveBeenCalled()
    });
})