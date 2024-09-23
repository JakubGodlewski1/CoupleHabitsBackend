import {UserDbSchema, UserPayload} from "../../../../types/user";

export const generateUserPayload = async (user: UserDbSchema):Promise<UserPayload> => {
    //get all the necessary data that is needed for the user, like habits, game account details etc.

    //TODO - IMPLEMENT ALL FUNCTIONS SO THE RETURN OBJECT CONTAINS ALL THE INFORMATION NEEDED

    return {
        avatar: user.avatar,
        email: user.email,
        habits: [],
        partner: {
            connected: false,
            avatar: null
        },
        gameAccount: {
            points: 0,
            strike: 0
        },
        connectionCode: user.connectionCode
    }
}