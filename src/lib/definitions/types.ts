import type { z } from 'zod';
import type { userSchema, sessionSchema, characterSchema, questionSchema } from './zod';
import type { character } from '~/db/schema';

export type UserData = z.infer<typeof userSchema>

export type SessionData = z.infer<typeof sessionSchema>

export type CharacterData = z.infer<typeof characterSchema>

export type QuestionSchema = z.infer<typeof questionSchema>

type MultipleChoiceQuestion = {//couldnt this just be QuestionSchema | choices: string[] or something like that
    id: string;
    question: string;
    correctAnswer: string;
    choices: string[]; // shuffled list including correct + 3 wrongs
    characterId: string;
    difficulty: number;
};