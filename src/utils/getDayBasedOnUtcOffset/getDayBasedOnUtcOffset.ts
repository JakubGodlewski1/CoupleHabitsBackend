import {addHours} from "date-fns";
import {MOCK_DATE} from "../../middleware/habits/setMockDateForTests";

export const getDayBasedOnUtcOffset = (utcOffset: number): number => {
        if (utcOffset > 14 || utcOffset < -12){
                throw new Error("UtcOffset outside of range")
        }

        const today = MOCK_DATE || new Date()

        return addHours(today, utcOffset).getUTCDay()
};

