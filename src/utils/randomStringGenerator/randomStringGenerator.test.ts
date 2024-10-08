import { expect, test, describe } from 'vitest';
import {randomStringGenerator} from "./randomStringGenerator.js";

describe('randomStringGenerator', () => {

    // Test 1: Check if the generated string has the correct length
    test('should generate a string of the requested length', () => {
        const length = 10;
        const randomString = randomStringGenerator(length);
        expect(randomString.length).toBe(length);
    });

    // Test 2: Check if the generated string only contains valid characters
    test('should generate a string containing only valid characters', () => {
        const length = 15;
        const randomString = randomStringGenerator(length);
        const validCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        for (const char of randomString) {
            expect(validCharacters.includes(char)).toBe(true);
        }
    });

    // Test 3: Ensure it generates different strings on multiple calls (basic randomness check)
    test('should generate different strings on consecutive calls', () => {
        const length = 8;
        const randomString1 = randomStringGenerator(length);
        const randomString2 = randomStringGenerator(length);

        expect(randomString1).not.toBe(randomString2);
    });
});