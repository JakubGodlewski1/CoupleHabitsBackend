import {describe, it} from "vitest";
import {Request, Response} from "express";
import {gameAccountDb} from "../../models/gameAccounts/gameAccount.model";
import {habitDb} from "../../models/habits/habit.model";
import {validateDayOff} from "./dayOff.middleware";
import {testData} from "../../utils/testData";

vi.mock("../../models/gameAccounts/gameAccount.model")
vi.mock("../../models/habits/habit.model")

describe('dayOffMiddleware', () => {
    const req = {} as Request
    const res = {locals:{user:{}}} as Response
    const next = vi.fn()

    vi.setSystemTime("2024-09-29T16:39:50.788Z")

    const {habits:{
        specificDaysFriAndSun: {specificDaysFriAndSunCompleted},
        weekly: { weeklyCompleted},
        daily:{dailyUncompleted,dailyCompleted}
    }} = testData

    const completedHabits = [dailyCompleted, weeklyCompleted, specificDaysFriAndSunCompleted]
    const uncompletedHabits = [dailyUncompleted, weeklyCompleted, specificDaysFriAndSunCompleted]

    const mockHabits = ({areCompleted}:{areCompleted:boolean}) => {
        vi.mocked(habitDb.find).mockResolvedValueOnce(areCompleted ? completedHabits : uncompletedHabits)
    }

    const mockGameAccount = ({points, dayOffPrice}:{points:number, dayOffPrice: number}) => {
        vi.mocked(gameAccountDb.findById).mockResolvedValueOnce({
            points,dayOffPrice
        })
    }


    it('should throw error if no game account is found', async () => {
        mockHabits({areCompleted: false})
        vi.mocked(gameAccountDb.findById).mockResolvedValueOnce(null)
        expect(()=>validateDayOff(req, res, next)).rejects.toThrow(/not find your game account/i)
    });

    it('should throw an error if user does not have enough points to take a day off', () => {
        mockHabits({areCompleted: false})
        mockGameAccount({points: 20, dayOffPrice: 30})
        expect(()=>validateDayOff(req, res, next)).rejects.toThrow(/don't have enough points/i)
    });

    it('should throw an error if user has completed all tasks scheduled for today and they try to take a day off', () => {
        mockHabits({areCompleted: true})
        mockGameAccount({points: 20, dayOffPrice: 10})
        expect(()=>validateDayOff(req, res, next)).rejects.toThrow(/are completed/i)
    });

    it('should call next if user has enough points and has not completed all the tasks scheduled for today', async () => {
        mockHabits({areCompleted: false})
        mockGameAccount({points: 20, dayOffPrice: 10})
        await validateDayOff(req, res, next)
        expect(next).toHaveBeenCalled()
    });

    it('should assign habits and gameAccount to res.locals.habits and res.locals.gameAccount', async  () => {
        mockHabits({areCompleted: false})
        mockGameAccount({points: 20, dayOffPrice: 10})
        await validateDayOff(req, res, next)

        expect(res.locals.habitsScheduledForToday).not.toEqual(undefined)
        expect(res.locals.gameAccount).toMatchObject({points: 20, dayOffPrice: 10})
    });
})