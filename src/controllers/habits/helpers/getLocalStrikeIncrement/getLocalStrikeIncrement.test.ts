import {describe} from "vitest";
import {habitDb} from "../../../../models/habits/habit.model";
import {UserDbSchema} from "../../../../../types/user";
import {HabitDbSchema} from "../../../../../types/habit";
import mongoose from "mongoose";
import {getLocalStrikeIncrement} from "./getLocalStrikeIncrement";

vi.mock("../../../../models/habits/habit.model")

describe("getLocalStrikeIncrement", () => {
    const habitId = "12345"
    const user = {id:"123", partnerId:"321"} as UserDbSchema
    const habit:HabitDbSchema = {
        updatedAt: new Date(),
        createdAt: new Date(),
        frequency: {
            type: "repeat",
            repeatOption: "daily"
        },
        _id: new mongoose.Types.ObjectId(),
        strike:0,
        lastTimeCompleted:null,
        details:[
            {userId:"123", completed: true, label:"test1"},
            {userId:"321", completed: true, label:"test2"}
        ]
    }

    it('should throw error if habit with given id does not exist', () => {
        const isCompleted=true;
        vi.mocked(habitDb.findById).mockResolvedValueOnce(null)
        expect(()=>getLocalStrikeIncrement(habitId, user, isCompleted)).rejects.toThrowError(
            /does not exist/i
        )

    });

    it('should return -1 if habit strike should be decremented', async () => {
        const details = [
            {  userId:"123", completed: true, label:"test"},
            {  userId:"321", completed: true, label:"test"},
        ]
        const isCompleted = false

        vi.mocked(habitDb.findById).mockResolvedValueOnce({...habit, details})
        const result = await getLocalStrikeIncrement(habitId, user, isCompleted)
       expect(result).toBe(-1)
    });

      it('should return 1 if habit strike should be incremented', async () => {
          const details = [
              {  userId:"123", completed: false, label:"test"},
              {  userId:"321", completed: true, label:"test"},
          ]
          const isCompleted = true

          vi.mocked(habitDb.findById).mockResolvedValueOnce({...habit, details})
          const result = await getLocalStrikeIncrement(habitId, user, isCompleted)
          expect(result).toBe(1)
      });

    it('should return 0 if no changes should be made to the habit strike', async () => {
        const details = [
            {  userId:"123", completed: false, label:"test"},
            {  userId:"321", completed: false, label:"test"},
        ]
        const isCompleted = true

        vi.mocked(habitDb.findById).mockResolvedValueOnce({...habit, details})
        const result = await getLocalStrikeIncrement(habitId, user, isCompleted)
        expect(result).toBe(0)
    });
})