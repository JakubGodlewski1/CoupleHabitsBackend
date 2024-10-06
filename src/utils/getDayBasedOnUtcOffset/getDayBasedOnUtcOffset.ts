import {addHours} from "date-fns";
import {MOCK_DATE} from "../../middleware/habits/setMockDateForTests";

export const getDayBasedOnUtcOffset = (utcOffset: number): {day:number, hour: number} => {
        if (utcOffset > 14 || utcOffset < -12){
                throw new Error("There is a problem with your timezone. Please contact our support team at help@couplehabits.com ")
        }

        const today = MOCK_DATE || new Date()

        return {
                day: addHours(today, utcOffset).getUTCDay(),
                hour: addHours(today, utcOffset).getUTCHours(),
        }

};

