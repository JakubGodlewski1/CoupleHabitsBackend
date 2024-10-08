import {UserDbSchema} from "../../../../types/user.js";

export const getUniqueUsers = (users:UserDbSchema[])=>{
    const temporaryGameAccountIds:any = []
    return users.filter(u => {
        if (temporaryGameAccountIds.includes(u.gameAccountId)) {
            return false
        } else {
            temporaryGameAccountIds.push(u.gameAccountId)
            return true
        }
    })


}