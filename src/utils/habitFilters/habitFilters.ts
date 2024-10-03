import {HabitDbSchema, HabitDbSchemaCreate, SpecificDays} from "../../../types/habit";

const daysOfTheWeek: { [key: number]: keyof SpecificDays } = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
}

export const habitFilters = {
    scheduledFor: (day: number, habits:HabitDbSchema[] | HabitDbSchemaCreate[])=> habits.filter(h=>{
        //daily
        if (h.frequency.type==="repeat" && h.frequency.repeatOption ==="daily"){
            return true
        }
        //weekly
        if (h.frequency.type==="repeat" && h.frequency.repeatOption ==="weekly" && day === 0){
            return true
        }
        //specific days
        return h.frequency.type === "specific days" && h.frequency.specificDaysOption[daysOfTheWeek[day]];
    }),


    validators: {
        areAllCompleted: (habits: HabitDbSchema[] | HabitDbSchemaCreate[])=> habits.every(h=>h.details.every(d=>d.completed)),

        areAllCompletedButOneUserTask: (habits:HabitDbSchema[] | HabitDbSchemaCreate[], userId: string)=> {
            //make sure that only one habit is not completed
            const uncompleted = habits.filter(h=>h.details.some(d=>!d.completed));
            if (uncompleted.length !==1){
                return false
            }

            //check if is uncompleted by current user and completed by partner. If yes, return true
            const hasUserCompleted = uncompleted[0].details.find(d=>d.userId===userId)!.completed
            const hasPartnerCompleted = uncompleted[0].details.find(d=>d.userId!==userId)!.completed

            return !hasUserCompleted && hasPartnerCompleted
        }
}

}