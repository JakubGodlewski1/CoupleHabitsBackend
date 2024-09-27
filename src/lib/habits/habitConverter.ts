import mongoose from "mongoose";
import {CreateHabit, FrontendHabit, HabitDbSchema, HabitDbSchemaCreate} from "../../../types/habit";

export const habitConverter = {

    fromCreateHabitToDbSchemaCreate: ({frequency, strike, details}:CreateHabit, ids:{user: string, partner:string}):HabitDbSchemaCreate=>{
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
        const myIndex = details[0].userId.toString() === userId ? 0 : 1
        const partnerIndex = myIndex === 0 ? 1 : 0

        return  {
            id: _id.toString(),
            strike,
            frequency,
            details:{
                mine: {
                    completed: details[myIndex].completed,
                    label: details[myIndex].label,
                },
                 partner: {
                    completed: details[partnerIndex].completed,
                    label: details[partnerIndex].label,
                },

            }
        } as FrontendHabit
    }

}