import {describe, expect} from "vitest";
import {HabitDbSchema} from "../../../types/habit";
import {habitFilters} from "./habitFilters";
import {testData} from "../testData";

describe("HabitFilters", () => {
    const {habits:{
        specificDaysSaturday:{
            specificDaysSaturdayUncompletedByPartner,
            specificDaysSaturdayCompleted,
            specificDaysSaturdayUncompleted,
            specificDaysSaturdayUncompletedByUser
        },
        specificDaysFriAndSun:{
            specificDaysFriAndSunCompleted,
            specificDaysFriAndSunUncompleted,
            specificDaysFriAndSunUncompletedByPartner,
            specificDaysFriAndSunUncompletedByUser
        },
        daily:{
            dailyCompleted,
            dailyUncompleted,
            dailyUncompletedByPartner,
            dailyUncompletedByUser
        },
        weekly:{
            weeklyCompleted,
            weeklyUncompleted,
            weeklyUncompletedByUser,
            weeklyUncompletedByPartner
        }
    }} = testData


    it.each([
        {today: 0, todayName:"sunday", expected: 12},
        {today: 1, todayName:"monday", expected: 4},
        {today: 2, todayName:"tuesday", expected: 4},
        {today: 3, todayName:"wednesday", expected: 4},
        {today: 4, todayName:"thursday", expected: 4},
        {today: 5, todayName:"friday", expected: 8},
        {today: 6, todayName:"saturday", expected: 8},
    ])("SCHEDULED FOR TODAY - should return $expected if today is $todayName", ({today, expected})=>{
        const habits = [
            dailyUncompleted, dailyUncompletedByUser, dailyUncompletedByPartner, dailyCompleted,
            weeklyUncompletedByPartner, weeklyUncompleted, weeklyUncompletedByUser, weeklyCompleted,
            specificDaysFriAndSunUncompletedByUser, specificDaysFriAndSunCompleted,
            specificDaysFriAndSunUncompletedByPartner, specificDaysFriAndSunUncompleted,
            specificDaysSaturdayUncompleted, specificDaysSaturdayCompleted,
            specificDaysSaturdayUncompletedByUser, specificDaysSaturdayUncompletedByPartner,
        ];

        const habitsScheduledForToday = habitFilters.scheduledForToday(habits, today)
        expect(habitsScheduledForToday.length).toBe(expected)
    })

    it('should return habits that are scheduled for today if saturday', () => {
        //2 habits in the array below are scheduled for saturday
        const habits = [weeklyUncompleted, dailyCompleted, specificDaysFriAndSunCompleted, specificDaysSaturdayCompleted]
        const habitsScheduledForToday = habitFilters.scheduledForToday(habits, 6)
        expect(habitsScheduledForToday.length).toBe(2)
    });

    it('should return habits that are scheduled for today if sunday', () => {
        //3 habits in the array below are scheduled for sunday
        const habits = [weeklyUncompleted, dailyCompleted, specificDaysFriAndSunCompleted, specificDaysSaturdayCompleted]

        const habitsScheduledForToday = habitFilters.scheduledForToday(habits, 0)
        expect(habitsScheduledForToday.length).toBe(3)
    });

    const allCompleted = [weeklyCompleted, dailyCompleted, specificDaysSaturdayCompleted]
    const uncompleted = [weeklyUncompleted, dailyCompleted, specificDaysSaturdayCompleted]
    const almostCompletedButUser = [dailyCompleted, weeklyUncompletedByUser, specificDaysSaturdayCompleted]
    const almostCompletedButPartner = [dailyUncompletedByPartner, weeklyCompleted, specificDaysSaturdayCompleted]


    it('ALL COMPLETED - should return true if all habits are completed and false if not', () => {
        expect(habitFilters.validators.areAllCompleted(allCompleted)).toBe(true)
        expect(habitFilters.validators.areAllCompleted(uncompleted)).toBe(false)
        expect(habitFilters.validators.areAllCompleted(almostCompletedButUser)).toBe(false)
        expect(habitFilters.validators.areAllCompleted(almostCompletedButPartner)).toBe(false)
    });


    it('ALL COMPLETED BUT ONE USER TASK', () => {
        expect(habitFilters.validators.areAllCompletedButOneUserTask(allCompleted, "123")).toBe(false)
        expect(habitFilters.validators.areAllCompletedButOneUserTask(uncompleted, "123")).toBe(false)
        expect(habitFilters.validators.areAllCompletedButOneUserTask(almostCompletedButPartner, "123")).toBe(false)
        expect(habitFilters.validators.areAllCompletedButOneUserTask(almostCompletedButUser, "123")).toBe(true)
    });
})