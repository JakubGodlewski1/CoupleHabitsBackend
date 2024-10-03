import {beforeEach, describe, expect} from "vitest";
import {getMidnightOffsets, nightReset} from "./nightReset.controller";
import {habitDb} from "../../models/habits/habit.model";
import {userDb} from "../../models/users/user.model";
import {gameAccountDb} from "../../models/gameAccounts/gameAccount.model";
import {withTransaction} from "../../lib/mongo/withTransaction";
import {testData} from "../../utils/testData";
import mongoose from "mongoose";
import {Request, Response} from "express";

vi.mock("../../models/habits/habit.model")
vi.mock("../../models/users/user.model")
vi.mock("../../models/gameAccounts/gameAccount.model")
vi.mock("../../lib/mongo/withTransaction")

describe("NightResetController", () => {
    const req = {} as Request
    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
    } as unknown as Response;

    const {habits:{
        daily:{dailyCompleted, dailyUncompleted, dailyUncompletedByPartner, dailyUncompletedByUser},
        weekly:{weeklyCompleted,weeklyUncompleted,weeklyUncompletedByUser,weeklyUncompletedByPartner},
        specificDaysSaturday: {specificDaysSaturdayUncompletedByPartner, specificDaysSaturdayCompleted,
            specificDaysSaturdayUncompletedByUser, specificDaysSaturdayUncompleted},
        specificDaysFriAndSun: {specificDaysFriAndSunCompleted, specificDaysFriAndSunUncompleted,
            specificDaysFriAndSunUncompletedByUser, specificDaysFriAndSunUncompletedByPartner}
    }} =  testData

    const gameAccountId = new mongoose.Types.ObjectId()

    vi.mocked(gameAccountDb.find).mockResolvedValue([
        {_id: gameAccountId, utcOffset: 0},
    ])

    vi.mocked(userDb.find).mockResolvedValue([
        {id:"123", gameAccountId},
        {id:"321", gameAccountId},
    ])

    const mockSunday = () => {
        vi.setSystemTime("2024-10-06T00:38:00.291Z")
    }

    const mockMonday = () => {
        vi.setSystemTime("2024-10-07T00:38:00.291Z")
    }

    beforeEach(()=>{
        vi.clearAllMocks()
    })


    it(`should reset global strike and local strikes if some habits scheduled for yesterday has not been completed 
    -today = sunday (if yesterday was saturday, it should not validate whether weekly habit has been completed yesterday or not`, async () => {
        const habitSets = [
            [dailyCompleted, weeklyCompleted, specificDaysSaturdayUncompletedByPartner],
            [dailyUncompleted, weeklyCompleted, specificDaysFriAndSunCompleted, specificDaysSaturdayCompleted],
            [dailyCompleted, weeklyUncompleted, specificDaysSaturdayUncompletedByUser],
        ]

        for (const habits of habitSets){
            vi.mocked(habitDb.find).mockResolvedValue(habits)
            mockSunday()
            await nightReset(req, res)
            expect(withTransaction).toHaveBeenCalledOnce()
            vi.clearAllMocks()
        }
    });

    it('should reset global strike and local strikes if some habits scheduled for yesterday has not been completed - today =  monday', async () => {
        const habitSets = [
            [dailyCompleted, weeklyCompleted, specificDaysFriAndSunUncompleted],
            [dailyUncompleted, weeklyCompleted, specificDaysFriAndSunCompleted],
            [dailyCompleted, weeklyUncompleted, specificDaysFriAndSunCompleted],
            [dailyCompleted, weeklyUncompletedByUser, specificDaysFriAndSunCompleted],
            [dailyCompleted, weeklyUncompletedByUser, specificDaysFriAndSunCompleted, specificDaysFriAndSunCompleted],
        ]

        for (const habits of habitSets){
            vi.mocked(habitDb.find).mockResolvedValue(habits)
            mockMonday()
            await nightReset(req, res)
            expect(withTransaction).toHaveBeenCalledOnce()
            vi.clearAllMocks()
        }
    });


    it('should not reset global strike nor local strikes if all habits scheduled for yesterday has been completed - today = sunday', async () => {
        const habits =  [dailyCompleted, weeklyCompleted, specificDaysSaturdayCompleted, specificDaysSaturdayCompleted, weeklyUncompleted, weeklyUncompletedByUser, weeklyUncompletedByPartner]

            vi.mocked(habitDb.find).mockResolvedValue(habits)
            mockSunday()
            await nightReset(req, res)
            expect(withTransaction).not.toHaveBeenCalledOnce()
    });

      it('should not reset global strike nor local strikes if all habits scheduled for yesterday has been completed - today = monday', async () => {
          const habits =  [dailyCompleted, weeklyCompleted, specificDaysSaturdayCompleted, specificDaysSaturdayCompleted]

          vi.mocked(habitDb.find).mockResolvedValue(habits)
          mockMonday()
          await nightReset(req, res)
          expect(withTransaction).not.toHaveBeenCalledOnce()
    });

    it('should reset all completions (marked as completed) of habits scheduled for yesterday. only on sunday weekly habit should be reset', async () => {
        const habits =  [dailyCompleted, weeklyCompleted, specificDaysSaturdayCompleted, specificDaysSaturdayCompleted]

        vi.mocked(habitDb.find).mockResolvedValue(habits)
        mockMonday()
        await nightReset(req, res)

        expect(habitDb.updateMany).toHaveBeenCalledOnce()
    });
})


describe("getMidnightOffset -should return number or numbers that after adding to current utc time, gives 0 or 24 ", () => {
    it.each(
        [
            {currentTime:"2024-10-02T00:00:00.000Z"},
            {currentTime:"2024-10-02T01:33:06.490Z"},
            {currentTime:"2024-10-02T02:33:06.490Z"},
            {currentTime:"2024-10-02T03:33:06.490Z"},
            {currentTime:"2024-10-02T04:33:06.490Z"},
            {currentTime:"2024-10-02T05:33:06.490Z"},
            {currentTime:"2024-10-02T06:33:06.490Z"},
            {currentTime:"2024-10-02T07:33:06.490Z"},
            {currentTime:"2024-10-02T08:33:06.490Z"},
            {currentTime:"2024-10-02T09:33:06.490Z"},
            {currentTime:"2024-10-02T09:33:06.490Z"},
            {currentTime:"2024-10-02T09:33:06.490Z"},
            {currentTime:"2024-10-02T10:33:06.490Z"},
            {currentTime:"2024-10-02T11:33:06.490Z"},
            {currentTime:"2024-10-02T12:33:06.490Z"},
            {currentTime:"2024-10-02T13:33:06.490Z"},
            {currentTime:"2024-10-02T14:33:06.490Z"},
            {currentTime:"2024-10-02T15:33:06.490Z"},
            {currentTime:"2024-10-02T16:33:06.490Z"},
            {currentTime:"2024-10-02T17:33:06.490Z"},
            {currentTime:"2024-10-02T18:33:06.490Z"},
            {currentTime:"2024-10-02T19:33:06.490Z"},
            {currentTime:"2024-10-02T20:33:06.490Z"},
            {currentTime:"2024-10-02T21:33:06.490Z"},
            {currentTime:"2024-10-02T22:33:06.490Z"},
            {currentTime:"2024-10-02T23:33:06.490Z"},
            {currentTime:"2024-10-02T00:33:06.490Z"},
        ]
    )("time - $currentTime",({currentTime})=>{
        vi.setSystemTime(currentTime);
        const result = getMidnightOffsets()
        result.forEach(e=>{
            expect([0, 24]).toContain(e + new Date(currentTime).getUTCHours())
        })
    })
})