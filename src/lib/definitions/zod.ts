import { z } from 'zod';

export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.boolean(),
    image: z.string().nullable(),
    createdAt: z.preprocess(val => new Date(val as string), z.date()),
    updatedAt: z.preprocess(val => new Date(val as string), z.date()),
});


export const sessionSchema = z.object({
    id: z.string(),
    expiresAt: z.preprocess(val => new Date(val as string), z.date()),
    token: z.string(),
    createdAt: z.preprocess(val => new Date(val as string), z.date()),
    updatedAt: z.preprocess(val => new Date(val as string), z.date()),
    ipAddress: z.string().optional().nullable(),
    userAgent: z.string().optional().nullable(),
    userId: z.string(),
});

export const accountSchema = z.object({
    id: z.string(),
    accountId: z.string(),
    providerId: z.string(),
    userId: z.string(),
    accessToken: z.string().optional().nullable(),
    refreshToken: z.string().optional().nullable(),
    idToken: z.string().optional().nullable(),
    accessTokenExpiresAt: z.preprocess(val => val ? new Date(val as string) : null, z.date().nullable()),
    refreshTokenExpiresAt: z.preprocess(val => val ? new Date(val as string) : null, z.date().nullable()),
    scope: z.string().optional().nullable(),
    password: z.string().optional().nullable(),
    createdAt: z.preprocess(val => new Date(val as string), z.date()),
    updatedAt: z.preprocess(val => new Date(val as string), z.date()),
});


export const verificationSchema = z.object({
    id: z.string(),
    identifier: z.string(),
    value: z.string(),
    expiresAt: z.preprocess(val => new Date(val as string), z.date()),
    createdAt: z.preprocess(val => new Date(val as string), z.date()),
    updatedAt: z.preprocess(val => new Date(val as string), z.date()),
});



export const boroughEnumVal = ['manhattan', 'the_bronx', 'staten_island', 'brooklyn'] as const;

export const characterSchema = z.object({
    id: z.string(),
    name: z.string(),
    prompt: z.string(),
    borough: z.enum(boroughEnumVal),
});

export const questionSchema = z.object({
    id: z.string().uuid(),
    question: z.string(),
    answer: z.string(),
    difficulty: z.number().int().min(1).max(100),
    characterId: z.string()
});

