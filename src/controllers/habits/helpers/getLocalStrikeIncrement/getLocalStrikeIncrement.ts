import {HabitDbSchema} from "../../../../../types/habit.js";
import {habitDb} from "../../../../models/habits/habit.model.js";
import {UserDbSchema} from "../../../../../types/user.js";

export const getLocalStrikeIncrement = async (habitId:string, user:UserDbSchema, isCompleted:boolean) => {
    //manage habit's task
    const habitBeforeUpdate:(HabitDbSchema | null)= await habitDb.findById(habitId)

    if (!habitBeforeUpdate){
        throw new Error("THe habit does not exist")
    }

        const userDetail = habitBeforeUpdate.details.find((detail) => detail.userId === user.id)!
        const partnerDetail = habitBeforeUpdate.details.find((detail) => detail.userId === user.partnerId)!

        //when decrement
        if (userDetail.completed && partnerDetail.completed && !isCompleted)
            return -1

        //when increment
        if (!userDetail.completed && partnerDetail.completed && isCompleted)
            return 1

        //when not to do anything
        else return 0
}