import {CreateHabit, FrontendHabit, HabitDbSchema, HabitDbSchemaCreate} from "../../../types/habit.js";

export const habitConverter = {

    fromFrontendHabitToDbSchema: ({frequency, strike, details}:CreateHabit, ids:{user: string, partner:string}):HabitDbSchemaCreate=>{
        return {
            frequency,
            strike,
            details: [
                {
                    userId: ids.user,
                    label: details.user.label,
                    completed:details.user.completed
                },
                 {
                    userId: ids.partner,
                    label: details.partner.label,
                     completed:details.partner.completed
                }
            ]
        }
    },
    fromDbHabitSchemaToFrontendHabit: ({habit:{strike, details, frequency, _id}, userId}:{habit:HabitDbSchema, userId: string}):FrontendHabit=> {
        const userIndex = details[0].userId.toString() === userId ? 0 : 1
        const partnerIndex = userIndex === 0 ? 1 : 0

        return  {
            id: _id.toString(),
            strike,
            frequency,
            details:{
                user: {
                    completed: details[userIndex].completed,
                    label: details[userIndex].label,
                },
                 partner: {
                    completed: details[partnerIndex].completed,
                    label: details[partnerIndex].label,
                },

            }
        } as FrontendHabit
    }

}