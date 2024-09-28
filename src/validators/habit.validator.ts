import {boolean, z} from 'zod';

// Define Repeat type validator
export const repeatValidator = z.enum(["daily", "weekly"]);

// Define Specific_days type validator
export const specificDaysValidator = z.object({
    monday: z.boolean(),
    tuesday: z.boolean(),
    wednesday: z.boolean(),
    thursday: z.boolean(),
    friday: z.boolean(),
    saturday: z.boolean(),
    sunday: z.boolean(),
});

// Define FrequencyType type validator
export const frequencyTypeValidator = z.enum(["repeat", "specific days"]);

// Define Frequency type validator
export const frequencyValidator = z.union([
    z.object({
        type: z.literal("repeat"),
        repeatOption: repeatValidator,
    }),
    z.object({
        type: z.literal("specific days"),
        specificDaysOption: specificDaysValidator,
    })
]);

// Define CreateHabit type validator
export const createHabitValidator = z.object({
    strike: z.number().min(0).default(0),
    frequency: frequencyValidator,
    details: z.object({
        user: z.object({
            label: z.string().min(2, "Label is too short.").max(50, "Label is too long. max 50 characters"),
            completed: z.boolean().default(false),
        }),
        partner: z.object({
            label: z.string().min(2, "Label is too short.").max(50, "Label is too long. max 50 characters"),
            completed: z.boolean().default(false),
        })
    })
});

export const toggleHabitValidator = z.object({
    isCompleted: z.boolean(),
})