import {beforeEach, describe, expect, it, vi} from "vitest";
import {HabitDbSchema} from "../../../../../../types/habit";
import {gameAccountDb} from "../../../../../models/gameAccounts/gameAccount.model";
import {testData} from "../../../../../utils/testData";
import {validateGlobalStrikeWhileAdding} from "./validateGlobalStrikeWhileAdding";
import {habitDb} from "../../../../../models/habits/habit.model";
import {manageGlobalStrike} from "../../../../../lib/gameAccount/manageGlobalStrike/manageGlobalStrike";
import {UserDbSchema} from "../../../../../../types/user";


vi.mock("../../../../../models/gameAccounts/gameAccount.model")
vi.mock("../../../../../models/habits/habit.model")
vi.mock("../../../../../lib/gameAccount/manageGlobalStrike/manageGlobalStrike")

    const habitBase = {
        strike:0,
        details:[
            {completed:false, label:"habit1", userId:"123"},
            {completed:false, label:"habit2", userId:"321"}
        ]} as HabitDbSchema

describe('validateGlobalStrikeWhileAdding', () => {
    const config = () => {
        const today = "2024-09-29T10:01:41.269Z" //sunday
        vi.setSystemTime(today)
        vi.mocked(gameAccountDb.findById).mockResolvedValue({utcOffset: 5})
    }

    beforeEach(()=>{
        vi.resetAllMocks()
    })

    const habitScheduledForToday:HabitDbSchema = {...habitBase, frequency: {type: "repeat", repeatOption: "weekly"}}
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
            daily:{dailyCompleted, dailyUncompleted},
            weekly:{weeklyCompleted, weeklyUncompleted},
            specificDaysFriAndSun:{specificDaysFriAndSunCompleted}
        }
    } = testData

    it('should decrease global strike and points if habit is scheduled for today and all habits scheduled for today have been completed', async () => {
        config()
        const habits:HabitDbSchema[] = [dailyCompleted, weeklyCompleted, specificDaysFriAndSunCompleted]

        vi.mocked(habitDb.find).mockResolvedValueOnce(habits)
        await validateGlobalStrikeWhileAdding(habitScheduledForToday, {} as UserDbSchema)
        expect(manageGlobalStrike.decrementStrikeAndPoints).toHaveBeenCalled()
    });

    it('should not decrease global strike and points if habit is not scheduled for today and all habits scheduled for today have been completed',async () => {
        config()
        const habits:HabitDbSchema[] = [dailyCompleted, weeklyCompleted, specificDaysFriAndSunCompleted]

        vi.mocked(habitDb.find).mockResolvedValueOnce(habits)
        await validateGlobalStrikeWhileAdding(habitNotScheduledForToday,  {} as UserDbSchema)
        expect(manageGlobalStrike.decrementStrikeAndPoints).not.toHaveBeenCalled()

    });

      it('should not decrease global strike and points if habit is scheduled for today and all habits scheduled for today have not been completed', async () => {
          config()
          const habits:HabitDbSchema[] = [dailyCompleted, weeklyUncompleted, specificDaysFriAndSunCompleted]

          vi.mocked(habitDb.find).mockResolvedValueOnce(habits)
          await validateGlobalStrikeWhileAdding(habitScheduledForToday,  {} as UserDbSchema)
          expect(manageGlobalStrike.decrementStrikeAndPoints).not.toHaveBeenCalled()

    });

    it('should not decrease global strike and points if habit is scheduled for today and there is no habit scheduled for today', async () => {
        config()
        const habits:HabitDbSchema[] = []

        vi.mocked(habitDb.find).mockResolvedValueOnce(habits)
        await validateGlobalStrikeWhileAdding(habitScheduledForToday,  {} as UserDbSchema)
        expect(manageGlobalStrike.decrementStrikeAndPoints).not.toHaveBeenCalled()
    });
})