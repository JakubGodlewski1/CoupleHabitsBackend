import {describe, expect} from "vitest";
import {validateCreateHabitBody} from "./createHabit.middleware";
import {Request, Response} from "express";

describe("validateCreateHabitBody", ()=>{
    const exampleCreateHabitData = {
        strike: 3,
        frequency: {
            type: "specific days",
            specificDaysOption: {
                monday: true,
                tuesday: false,
                wednesday: true,
                thursday: false,
                friday: true,
                saturday: false,
                sunday: false,
            }
        },
        details: {
            user: {
                label: "Morning Workout",
                completed: false,
            },
            partner: {
                label: "drink coffee as partner",
                completed: true,
            }
        }
    };
    const exampleCreateHabitDataIncorrect = {
        frequency: {
            type: "specific days",
            specificDaysOption: {
                monday: true,
                tuesday: false,
                wednesday: true,
                thursday: false,
                friday: true,
                saturday: false,
                sunday: false,
            }
        },
        details: {
            partner: {
                label: "Morning Run with Partner",
                completed: true,
            }
        }
    };

    const req = {} as Request
    const res = {} as Response
    const next = vi.fn()

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