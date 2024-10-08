import {beforeEach, describe, expect, it, vi} from "vitest";
import {HabitDbSchema} from "../../../../../../types/habit.js";
import {gameAccountDb} from "../../../../../models/gameAccounts/gameAccount.model.js";
import {testData} from "../../../../../utils/testData.js";
import {validateGlobalStrikeWhileRemoving} from "./validateGlobalStrikeWhileDeleting.js";
import {habitDb} from "../../../../../models/habits/habit.model.js";
import {manageGlobalStrike} from "../../../../../lib/gameAccount/manageGlobalStrike/manageGlobalStrike.js";

vi.mock("../../../../../models/gameAccounts/gameAccount.model")
vi.mock("../../../../../models/habits/habit.model")
vi.mock("../../../../../lib/gameAccount/manageGlobalStrike/manageGlobalStrike")

    const habitBase = {
        _id: "123" as any,
        strike:0} as HabitDbSchema

describe('validateGlobalStrikeWhileRemoving', () => {
    const config = (habit:HabitDbSchema) => {
        const today = "2024-09-29T10:01:41.269Z" //sunday
        vi.setSystemTime(today)
        vi.mocked(gameAccountDb.findById).mockResolvedValue({utcOffset: 5})
        vi.mocked(habitDb.findById).mockResolvedValue(habit)
    }

    beforeEach(()=>{
        vi.resetAllMocks()
    })

    const habitScheduledForTodayCompleted:HabitDbSchema = {
        ...habitBase,
        frequency: {type: "repeat", repeatOption: "weekly"},
        details:[
            {completed:true, label:"habit1", userId:"123"},
            {completed:true, label:"habit2", userId:"321"}
        ]
    }
    const habitScheduledForTodayUncompleted:HabitDbSchema = {
        ...habitBase,
        frequency: {type: "repeat", repeatOption: "weekly"},
        details:[
            {completed:true, label:"habit1", userId:"123"},
            {completed:false, label:"habit2", userId:"321"}
        ]
    }
    const habitNotScheduledForToday:HabitDbSchema = {...habitBase, frequency:{type:"specific days", specificDaysOption: {
        monday: false,
        tuesday: false,
        wednesday: true,
        thursday: false,
        friday: true,
        saturday: false,
        sunday: false
            }}}


    const {
        habits:{
            daily:{dailyCompleted},
            weekly:{weeklyCompleted},
            specificDaysFriAndSun:{specificDaysFriAndSunCompleted, specificDaysFriAndSunUncompleted}
        }
    } = testData

    it(`Should increase global strike and points if:
        - it was scheduled for today
        - it was not completed
        - it was not the only habit scheduled for today
        - all other habits scheduled for today have been completed
     `, async () => {
        config(habitScheduledForTodayUncompleted)
        const habits = [dailyCompleted, weeklyCompleted, specificDaysFriAndSunCompleted]
        vi.mocked(habitDb.find).mockResolvedValueOnce(habits)
        await validateGlobalStrikeWhileRemoving("123" as any, {} as any)
        expect(manageGlobalStrike.incrementStrikeAndPoints).toHaveBeenCalled()
    });

        it(`Should not increase global strike and points if:
        - it was scheduled for today
        - it was completed
        - it was not the only habit scheduled for today
        - all other habits scheduled for today have been completed
     `, async () => {
        config(habitScheduledForTodayCompleted)
        const habits = [dailyCompleted, weeklyCompleted, specificDaysFriAndSunCompleted]
        vi.mocked(habitDb.find).mockResolvedValueOnce(habits)
        await validateGlobalStrikeWhileRemoving("123" as any, {} as any)
        expect(manageGlobalStrike.incrementStrikeAndPoints).not.toHaveBeenCalled()
    });



       it(`Should not increase global strike and points if:
        - it was not scheduled for today
        - all other habits were scheduled for today
        - all other habits scheduled for today have been completed
     `, async () => {
           config(habitNotScheduledForToday)
           const habits = [dailyCompleted, weeklyCompleted, specificDaysFriAndSunCompleted]
           vi.mocked(habitDb.find).mockResolvedValueOnce(habits)
           await validateGlobalStrikeWhileRemoving("123" as any, {} as any)
           expect(manageGlobalStrike.incrementStrikeAndPoints).not.toHaveBeenCalled()
    });

        it(`Should not increase global strike and points if:
        - it was scheduled for today
        - it was  the only habit scheduled for today
     `, async () => {
            config(habitScheduledForTodayUncompleted)
            const habits:HabitDbSchema[] = []
            vi.mocked(habitDb.find).mockResolvedValueOnce(habits)
            await validateGlobalStrikeWhileRemoving("123" as any, {} as any)
            expect(manageGlobalStrike.incrementStrikeAndPoints).not.toHaveBeenCalled()
    });
         it(`Should not increase global strike and points if:
         - it was scheduled for today
        - it was not the only habit scheduled for today
        - not all habits scheduled for today have been completed
     `, async () => {
             config(habitScheduledForTodayUncompleted)
             const habits:HabitDbSchema[] = [dailyCompleted, weeklyCompleted, specificDaysFriAndSunUncompleted]
             vi.mocked(habitDb.find).mockResolvedValueOnce(habits)
             await validateGlobalStrikeWhileRemoving("123" as any, {} as any)
             expect(manageGlobalStrike.incrementStrikeAndPoints).not.toHaveBeenCalled()
    });
})
