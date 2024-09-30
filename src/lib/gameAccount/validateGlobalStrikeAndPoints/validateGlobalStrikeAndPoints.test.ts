import {beforeEach, describe, expect} from "vitest";
import {manageGlobalStrike} from "../manageGlobalStrike/manageGlobalStrike";
import {habitDb} from "../../../models/habits/habit.model";
import {gameAccountDb} from "../../../models/gameAccounts/gameAccount.model";
import {validateGlobalStrikeAndPoints} from "./validateGlobalStrikeAndPoints";
import {UserDbSchema} from "../../../../types/user";
import {testData} from "../../../utils/testData";

vi.mock("../manageGlobalStrike/manageGlobalStrike")
vi.mock("../../../models/habits/habit.model")
vi.mock("../../../models/gameAccounts/gameAccount.model")

describe("validateGlobalStrikeAndPoints tests", () => {
    const {habits:{
        daily:{dailyCompleted, dailyUncompletedByPartner, dailyUncompletedByUser},
        weekly:{weeklyCompleted, weeklyUncompletedByUser, weeklyUncompletedByPartner, weeklyUncompleted},
        specificDaysFriAndSun:{specificDaysFriAndSunUncompletedByPartner, specificDaysFriAndSunCompleted, specificDaysFriAndSunUncompletedByUser},
        specificDaysSaturday:{specificDaysSaturdayCompleted, specificDaysSaturdayUncompletedByUser}
    }} = testData

    const user = {
        id:"123"
    } as UserDbSchema

    beforeEach(()=>{
        vi.resetAllMocks()
    })

    const mockSaturday = () => {
        vi.mocked(gameAccountDb.findById).mockResolvedValue({
            utcOffset: 5
        })
        vi.setSystemTime("2024-09-27T20:38:00.291Z")
    }

    const mockSunday = () => {
        vi.mocked(gameAccountDb.findById).mockResolvedValue({
            utcOffset: 5
        })
        vi.setSystemTime("2024-09-29T16:38:00.291Z")
    }

    it(`should increment strike and points if today is saturday, and: 
        - there is a weekly undone habit
        - there is a specific day habit set for friday and sunday and it is not completed
        - there is daily habit and it is completed
        - there is a specific day habit set for saturday and it is completed
    `, async () => {
        vi.mocked(habitDb.find).mockResolvedValueOnce(
            [
                weeklyUncompletedByPartner,
                specificDaysFriAndSunUncompletedByPartner,
                dailyCompleted,
                specificDaysSaturdayCompleted
            ])

        mockSaturday()

        await validateGlobalStrikeAndPoints(user, true)
        expect(manageGlobalStrike.incrementStrikeAndPoints).toHaveBeenCalled()
    });

    it(`should increment strike and points if today is sunday and:
        - daily done
        - weekly done
        - specific days - friday  and saturday completed
    `, async () => {
        vi.mocked(habitDb.find).mockResolvedValueOnce(
            [
               weeklyCompleted,
                dailyCompleted,
                specificDaysFriAndSunCompleted
            ])

        mockSunday()

        await validateGlobalStrikeAndPoints(user, true)
        expect(manageGlobalStrike.incrementStrikeAndPoints).toHaveBeenCalled()
    });

    it(`should not increment strike and points if today is sunday and:
        - there is weekly undone habit,
        - daily completed
    `, async () => {
        vi.mocked(habitDb.find).mockResolvedValueOnce(
            [
                weeklyUncompletedByUser,
                dailyCompleted
            ])

        mockSunday()

        await validateGlobalStrikeAndPoints(user, true)
        expect(manageGlobalStrike.incrementStrikeAndPoints).not.toHaveBeenCalled()
    });
    
     it(`should not increment strike and points if today is saturday and:
        - there is a specific days habit set for saturday and it is not completed
    `, async () => {
         vi.mocked(habitDb.find).mockResolvedValueOnce(
             [
                specificDaysSaturdayUncompletedByUser
             ])

         mockSaturday()

         await validateGlobalStrikeAndPoints(user, true)
         expect(manageGlobalStrike.incrementStrikeAndPoints).not.toHaveBeenCalled()
    });
     
     it(`should decrement strike and points if today is saturday and:
        - there is one daily habit completed
        - there is one weekly habit uncompleted
        - there is one daily habit undone by user
        - hasCompleted value is set to false
    `, async () => {
         vi.mocked(habitDb.find).mockResolvedValueOnce(
             [
                dailyCompleted,
               weeklyUncompleted,
               dailyUncompletedByUser,
             ])

         mockSaturday()

         await validateGlobalStrikeAndPoints(user, false)
         expect(manageGlobalStrike.incrementStrikeAndPoints).not.toHaveBeenCalled()
         expect(manageGlobalStrike.decrementStrikeAndPoints).toHaveBeenCalled()
    });
     
     it(`should decrement strike and points if today is saturday and:
        - there is a daily completed habit
        - there is one specific days habit set to saturday and is not completed by user
        - hasCompleted value is set to false
    `, async () => {
         vi.mocked(habitDb.find).mockResolvedValueOnce(
             [
                 dailyCompleted,
                 specificDaysSaturdayUncompletedByUser
             ])

         mockSaturday()

         await validateGlobalStrikeAndPoints(user, false)
         expect(manageGlobalStrike.incrementStrikeAndPoints).not.toHaveBeenCalled()
         expect(manageGlobalStrike.decrementStrikeAndPoints).toHaveBeenCalled()
    });
     
      it(`should decrement strike and points if today is sunday and:
        - there is daily habit completed
         - there is one weekly habit and it is not completed by user
         - hasCompleted value is set to false
    `, async () => {
          vi.mocked(habitDb.find).mockResolvedValueOnce(
              [
                  dailyCompleted,
                  weeklyUncompletedByUser
              ])

          mockSunday()

          await validateGlobalStrikeAndPoints(user, false)
          expect(manageGlobalStrike.incrementStrikeAndPoints).not.toHaveBeenCalled()
          expect(manageGlobalStrike.decrementStrikeAndPoints).toHaveBeenCalled()
    });
      
       it(`should not decrement nor increment strike and points if today is saturday and:
        - there is daily habit completed 
        - there is one weekly habit and it is not completed by user
        - hasCompleted value is set to false
    `, async () => {
           vi.mocked(habitDb.find).mockResolvedValueOnce(
               [
                   dailyCompleted,
                   weeklyUncompletedByUser
               ])

           mockSaturday()

           await validateGlobalStrikeAndPoints(user, false)
           expect(manageGlobalStrike.incrementStrikeAndPoints).not.toHaveBeenCalled()
           expect(manageGlobalStrike.decrementStrikeAndPoints).not.toHaveBeenCalled()
    });
       
       
       it(`should not decrement nor increment strike and points if today is saturday and:
        - there is daily habit completed
        - there is specific days habit set to friday and sunday and is uncompleted by user
        - hasCompleted value is set to false
        
    `, async () => {
           vi.mocked(habitDb.find).mockResolvedValueOnce(
               [
                   dailyCompleted,
                   specificDaysFriAndSunUncompletedByUser
               ])

           mockSaturday()

           await validateGlobalStrikeAndPoints(user, false)
           expect(manageGlobalStrike.incrementStrikeAndPoints).not.toHaveBeenCalled()
           expect(manageGlobalStrike.decrementStrikeAndPoints).not.toHaveBeenCalled()
       })
        it(`should not decrement strike and points if today is saturday and:
         - there is weekly uncompleted habit
         - there is one daily habit uncompleted by partner
    `, async () => {
            vi.mocked(habitDb.find).mockResolvedValueOnce(
                [
                    weeklyUncompleted,
                    dailyUncompletedByPartner
                ])

            mockSaturday()

            await validateGlobalStrikeAndPoints(user, false)
            expect(manageGlobalStrike.incrementStrikeAndPoints).not.toHaveBeenCalled()
            expect(manageGlobalStrike.decrementStrikeAndPoints).not.toHaveBeenCalled()
    });
})