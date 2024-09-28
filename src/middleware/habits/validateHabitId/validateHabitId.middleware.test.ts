import {beforeEach, describe, expect} from "vitest";
import {NextFunction, Request, Response} from "express";
import {validateHabitId} from "./validateHabitId.middleware";
import {habitDb} from "../../../models/habits/habit.model";
import {testData} from "../../../utils/exampleDataForTests";
import {HabitDbSchema} from "../../../../types/habit";

vi.mock("../../../models/habits/habit.model")

describe("validateHabitIdMiddleware", () => {
    let req = {params:{}} as Request
    let res = {locals:{user: testData.user}} as Response
    let next = vi.fn() as NextFunction;

    beforeEach(()=>{
        req = {params:{}} as Request
        res =  {locals:{user: testData.user}} as Response
        next = vi.fn() as NextFunction;
    })

    it('should throw an error if habit id is not in params', () => {
        req.params = {}
        expect(()=>validateHabitId(req, res, next)).rejects.toThrowError(/did not provide habit id/i)
    });

    it('should throw an error if the provided id is not of mongodb type', () => {
        req.params.id = "123123d132"
        expect(()=>validateHabitId(req, res, next)).rejects.toThrowError(/is not valid/i)
    });

    it('should throw an error if habit with given id does not exist in db', () => {
        req.params.id = "507f1f77bcf86cd799439011"
        vi.mocked(habitDb.findById).mockResolvedValueOnce(null)
        expect(()=>validateHabitId(req, res, next)).rejects.toThrowError(/does not exist/i)
    });

    it('should throw an error if the habit does not belong to neither user nor their partner', () => {
        req.params.id = "507f1f77bcf86cd799439011" //habit id
        vi.mocked(habitDb.findById).mockResolvedValueOnce({details:[{userId:"CLRK123456"},{userId:"CLRK654321"}]} as Partial<HabitDbSchema>)
        expect(()=>validateHabitId(req, res, next)).rejects.toThrowError(/not authorized/i)
    });

    it('should call next if the given habit belongs to user', async () => {
        req.params.id = "507f1f77bcf86cd799439011" //habit id
        vi.mocked(habitDb.findById).mockResolvedValueOnce({details:[{userId:"CLRK123456"},{userId:"CLRK654321"}]} as Partial<HabitDbSchema>)
        res.locals.user = {...testData.user, id: "CLRK123456"}
        await validateHabitId(req, res, next)
        expect(next).toHaveBeenCalled()
    });
})