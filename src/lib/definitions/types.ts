import type { z } from 'zod';
import type { userSchema, sessionSchema, characterSchema, questionSchema } from './zod';
import type { character } from '~/db/schema';

export type UserData = z.infer<typeof userSchema>

export type SessionData = z.infer<typeof sessionSchema>

export type CharacterData = z.infer<typeof characterSchema>

export type QuestionSchema = z.infer<typeof questionSchema>