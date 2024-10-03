import {describe, expect} from "vitest";
import {getDayBasedOnUtcOffset} from "./getDayBasedOnUtcOffset";

describe("getDayBasedOnUtcOffset", () => {
    it('should throw an error if utc offset is outside of range', () => {
       expect(()=>getDayBasedOnUtcOffset(15).day).toThrowError("outside of range");
       expect(()=>getDayBasedOnUtcOffset(-13).day).toThrowError("outside of range");
    });

    it.each([
        {mockDate:"2024-09-30T05:00:00Z", offset: 0, dayResult: 1},
        {mockDate:"2024-09-30T05:00:00Z", offset: -6, dayResult: 0},
        {mockDate:"2024-09-30T20:00:00Z", offset: 5, dayResult: 2},
        {mockDate:"2024-09-30T00:00:00Z", offset: 5, dayResult: 1},
        {mockDate:"2024-09-30T00:00:00Z", offset: -5, dayResult: 0},
        {mockDate:"2024-09-30T00:00:00Z", offset: -1, dayResult: 0},
        {mockDate:"2024-09-30T15:00:00Z", offset: 12, dayResult: 2},
        {mockDate:"2024-09-30T12:00:00Z", offset: -12, dayResult: 1},
        {mockDate:"2024-09-30T11:00:00Z", offset: -12, dayResult: 0},

    ])("Should return $dayResult based on current utc and utc offset", ({mockDate, offset, dayResult})=>{
        vi.setSystemTime(mockDate)
        const currentDay = getDayBasedOnUtcOffset(offset).day;
        expect(currentDay).toBe(dayResult);
    })
})