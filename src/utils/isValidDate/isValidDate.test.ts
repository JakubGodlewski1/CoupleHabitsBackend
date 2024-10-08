import { describe, it, expect } from 'vitest';
import {isValidDate} from "./isValidDate.js";

describe('isValidDate', () => {
    it('should return true for a valid date string with parentheses', () => {
        const validDate = "Mon Sep 23 2024 18:44:13 GMT+0100 (British Summer Time)";
        expect(isValidDate(validDate)).toBe(true);
    });

    it('should return true for a valid date string without parentheses', () => {
        const validDate = "Mon Sep 23 2024 18:44:13 GMT+0100";
        expect(isValidDate(validDate)).toBe(true);
    });

    it('should return false for an invalid date format', () => {
        const invalidDate = "23 Sep 2024 18:44:13 GMT+0100";
        expect(isValidDate(invalidDate)).toBe(false);
    });

    it('should return false for an incomplete date string', () => {
        const incompleteDate = "Mon Sep 23 2024";
        expect(isValidDate(incompleteDate)).toBe(false);
    });

    it('should return false for a string that is not a date', () => {
        const notADate = "This is not a date";
        expect(isValidDate(notADate)).toBe(false);
    });

    it('should return false for a date with wrong time zone format', () => {
        const wrongTimezone = "Mon Sep 23 2024 18:44:13 GMT01:00";
        expect(isValidDate(wrongTimezone)).toBe(false);
    });
});