import {beforeEach, describe} from "vitest";
import {userDb} from "../../../models/users/user.model";
import {testData} from "../../../utils/exampleDataForTests";
import {handleUserExists} from "./handleUserExists.middleware";

vi.mock("../../../models/users/user.model")

describe("handleUserExists", () => {
    const {user, req, res, next} = testData

    vi.mocked(userDb.create).mockResolvedValue(user as any)
    beforeEach(()=>{
        vi.clearAllMocks()
    })

    it('should create a new user in db if it does not exist', async () => {
        //there is no user in db
        vi.mocked(userDb.findOne).mockResolvedValue(null)
        await handleUserExists(req, res, next)
        expect(userDb.create).toHaveBeenCalled()
        expect(res.locals.user).toMatchObject(user)
    });


    it('should not create a user in db in the user alraedy exist', async () => {
        //there is user in db
        vi.mocked(userDb.findOne).mockResolvedValue(user)
        await handleUserExists(req, res, next)
        expect(userDb.create).not.toHaveBeenCalled()
        expect(res.locals.user).toMatchObject(user)
    });
})