import {describe} from "vitest";
import {userDb} from "../../../models/users/user.model";
import {randomStringGenerator} from "../../../utils/randomStringGenerator/randomStringGenerator";
import {generateConnectionCode} from "./generateConnectionCode";

vi.mock("../../../models/users/user.model")
vi.mock("../../../utils/randomStringGenerator/randomStringGenerator")

describe("generateConnectionCode",  () => {
    it('should generate a connection code when the same code does not exist in db', async () => {
        const initCode = "123456"

        vi.mocked(userDb.findOne).mockResolvedValue(null);
        vi.mocked(randomStringGenerator).mockReturnValueOnce(initCode);
        const code =await generateConnectionCode()
        expect(code).toMatch(initCode)
    });

    it("should generate a new connection code when initially generated code existed in db", async () => {
        const initCode = "123456";
        const secondCode = "654321";

        // Mocking the randomStringGenerator to return specific codes in sequence
        vi.mocked(randomStringGenerator)
            .mockReturnValueOnce(initCode) // First code is "123456"
            .mockReturnValueOnce(secondCode); // Second code is "654321"

        // Mock userDb.findOne to simulate that the first code exists in the database
        vi.mocked(userDb.findOne)
            .mockResolvedValueOnce({}) // The first code exists (i.e., "123456" exists)
            .mockResolvedValueOnce(null); // The second code doesn't exist (i.e., "654321" is unique)

        // Call the function
        const code = await generateConnectionCode();

        // Check that the code returned is the second one, "654321"
        expect(code).toBe(secondCode);
    });
})