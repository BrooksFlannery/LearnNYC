import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { db } from '~/db/drizzle'
import { character, question } from '~/db/schema';
import { eq } from 'drizzle-orm';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, characterId } = await req.json();

    async function giveQuestion() {
        console.log('GIVE QUESTION for characterId:', characterId)
        const questions = await db
            .select()
            .from(question)
            .where(eq(question.characterId, characterId));

        console.log('Found questions:', questions.length);

        if (!questions || questions.length === 0) {
            return 'Actually im all out of questions, you win!';
        }

        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        console.log('Selected question:', JSON.stringify(randomQuestion));
        return JSON.stringify(randomQuestion);
    }

    const result = streamText({
        model: openai('gpt-4o-mini'),
        messages,
        maxSteps: 2,
        tools: {
            hintQuiz: tool({
                description: "ONLY call this when a user asks for help on the quiz: ONLY ONCE PER CHAT",
                parameters: z.object({
                    userMessage: z.string().describe('ONLY when the user asks for help on the quiz: ONLY ONCE PER CHAT'),
                }),
                execute: async () => {
                    console.log('user is using their one hint');
                    //if(hints > 0)
                    return 'give a hint';
                    //return 'no hint for you'
                }
            }),

            correctQuiz: tool({
                description: "ONLY call this when a user answers the LAST quiz CORRECTLY ",
                parameters: z.object({
                    userMessage: z.string().describe('ONLY when the user answers the LAST quiz CORRECTLY'),
                }),
                execute: async () => {
                    console.log('PLUS POINTS')
                    return giveQuestion()
                }
            }),
            incorrectQuiz: tool({
                description: "ONLY call this when a user answers the LAST quiz INCORRECTLY ONLY",
                parameters: z.object({
                    userMessage: z.string().describe('ONLY when the user answers the LAST quiz INCORRECTLY'),
                }),
                execute: async () => {
                    console.log('MINUS POINTS')
                    return giveQuestion();
                }
            }),
            exitQuiz: tool({
                description: "ONLY call this when a user avoids or tries to quit the quiz. we respond with a new quiz",
                parameters: z.object({
                    userMessage: z.string().describe('ONLY when the user avoids or tries to quit the quiz. we respond with a new quiz'),
                }),
                execute: async () => {
                    console.log('MINUS POINTS QUITER')
                    return giveQuestion();
                }
            }),
            giveQuiz: tool({
                description: "after asks for a quiz",
                parameters: z.object({
                    userMessage: z.string().describe('user asks for a quiz'),
                }),
                execute: async () => {
                    console.log('USER WANTS A QUIZ')

                    return giveQuestion();
                }
            })
        },
    });

    return result.toDataStreamResponse();
}