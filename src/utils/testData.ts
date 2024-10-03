import mongoose from "mongoose";
import {HabitDbSchema} from "../../types/habit";

const base = {
    _id: new mongoose.Types.ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    strike:0
}

const detailsCompleted = [
    {userId:"123", completed:true, label:"lala"},
    {userId:"321", completed:true, label:"lala"}
]

const detailsUncompleted = [
    {userId:"123", completed:false, label:"lala"},
    {userId:"321", completed:false, label:"lala"}
]

const detailsUncompletedByUser = [
    {userId:"123", completed:false, label:"lala"},
    {userId:"321", completed:true, label:"lala"}
]

const detailsUncompletedByPartner = [
    {userId:"123", completed:true, label:"lala"},
    {userId:"321", completed:false, label:"lala"}
]


const frequencyDaily = {type:"repeat", repeatOption:"daily"}
const frequencyWeekly = {type:"repeat", repeatOption:"weekly"}
const frequencySpecificDaysFridaySunday = {type:"specific days", specificDaysOption:{
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: true,
        saturday: false,
        sunday: true,
    }}
const frequencySpecificDaysSaturday = {type:"specific days", specificDaysOption:{
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: true,
        sunday: false,
    }}


//daily
const dailyCompleted = {
    ...base,
    frequency:frequencyDaily,
    details:detailsCompleted
} as HabitDbSchema

const dailyUncompleted = {
    ...base,
    frequency:frequencyDaily,
    details:detailsUncompleted
} as HabitDbSchema

const dailyUncompletedByUser = {
    ...base,
    frequency:frequencyDaily,
    details: detailsUncompletedByUser
} as HabitDbSchema

const dailyUncompletedByPartner = {
    ...base,
    frequency:frequencyDaily,
    details:detailsUncompletedByPartner
}  as HabitDbSchema

//specific days - friday and sunday
const specificDaysFriAndSunUncompletedByUser = {
    ...base,
    frequency:frequencySpecificDaysFridaySunday,
    details:detailsUncompletedByUser
}  as HabitDbSchema

const specificDaysFriAndSunUncompletedByPartner = {
    ...base,
    frequency:frequencySpecificDaysFridaySunday,
    details:detailsUncompletedByPartner
}  as HabitDbSchema

const specificDaysFriAndSunCompleted = {
    ...base,
    frequency:frequencySpecificDaysFridaySunday,
    details:detailsCompleted
}  as HabitDbSchema

const specificDaysFriAndSunUncompleted = {
    ...base,
    frequency:frequencySpecificDaysFridaySunday,
    details:detailsUncompleted
}  as HabitDbSchema



//specific days - saturday
const specificDaysSaturdayUncompletedByUser = {
    ...base,
    frequency:frequencySpecificDaysSaturday,
    details:detailsUncompletedByUser
}  as HabitDbSchema

const specificDaysSaturdayUncompletedByPartner = {
    ...base,
    frequency:frequencySpecificDaysSaturday,
    details:detailsUncompletedByPartner
}  as HabitDbSchema

const specificDaysSaturdayCompleted = {
    ...base,
    frequency:frequencySpecificDaysSaturday,
    details:detailsCompleted
}  as HabitDbSchema

const specificDaysSaturdayUncompleted = {
    ...base,
    frequency:frequencySpecificDaysSaturday,
    details:detailsUncompleted
}  as HabitDbSchema

//weekly
const weeklyCompleted =  {
    ...base,
    frequency:frequencyWeekly,
    details:detailsCompleted
}  as HabitDbSchema

const weeklyUncompleted =  {
    ...base,
    frequency:frequencyWeekly,
    details:detailsUncompleted
}  as HabitDbSchema

const weeklyUncompletedByPartner =  {
    ...base,
    frequency:frequencyWeekly,
    details:detailsUncompletedByPartner
}  as HabitDbSchema

const weeklyUncompletedByUser = {
    ...base,
    frequency:frequencyWeekly,
    details:detailsUncompletedByUser
}  as HabitDbSchema


export const testData = {
    habits: {
        daily: {
            dailyCompleted,
            dailyUncompletedByPartner,
            dailyUncompletedByUser,
            dailyUncompleted,
        },
        weekly:{
            weeklyCompleted,
            weeklyUncompletedByUser,
            weeklyUncompletedByPartner,
            weeklyUncompleted,
        },
        specificDaysFriAndSun:{
            specificDaysFriAndSunUncompleted,
            specificDaysFriAndSunUncompletedByPartner,
            specificDaysFriAndSunUncompletedByUser,
            specificDaysFriAndSunCompleted
        },
          specificDaysSaturday:{
            specificDaysSaturdayUncompleted,
            specificDaysSaturdayUncompletedByPartner,
            specificDaysSaturdayUncompletedByUser,
            specificDaysSaturdayCompleted
        },

    }
}