import {UserDbSchema, UserPayload} from "../../../../types/user";
import {getGameAccount, getHabits, getPartnerAvatar} from "./helpers";
import {FrontendHabit} from "../../../../types/habit";

export const generateUserPayload = async (user: UserDbSchema):Promise<UserPayload> => {
    //get all the necessary data that is needed for the user, like habits, game account details etc.

    let partnerAvatar = null;
    let habits:FrontendHabit[] = []
    let gameAccount = {
        points: 0,
        strike: 0
    }

    if (user.partnerId && user.gameAccountId){
        partnerAvatar = await getPartnerAvatar(user.partnerId);
        habits = await getHabits(user.id, user.partnerId);
        gameAccount = await getGameAccount(user.gameAccountId)
    }

    return {
        avatar: user.avatar,
        email: user.email,
        habits,
        partner: {
            connected: !!user.partnerId,
            avatar: partnerAvatar
        },
        gameAccount,
        connectionCode: user.connectionCode
    }
}