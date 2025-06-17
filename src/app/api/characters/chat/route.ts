
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { db } from '~/db/drizzle'
import { question } from '~/db/schema';
import { eq } from 'drizzle-orm';


export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: openai('gpt-4o-mini'),
        messages,
        maxSteps: 2,
        tools: {
            hintQuiz: tool({
                description: "ONLY call this when a user asks for help on the quiz for the FIRST time in the chat",
                parameters: z.object({
                    userMessage: z.string().describe('ONLY when the user asks for help on the quiz for the FIRST time in the chat'),
                }),
                execute: async ({ userMessage }) => {
                    console.log('user is avoiding the question');
                    console.log('User said:', userMessage);
                    console.log('Timestamp:', new Date().toISOString());

                    return 'give a hint';
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
                description: "ONLY call this when a user answers the LAST quiz INCORRECTLY ONLY OR if they avoid the question",
                parameters: z.object({
                    userMessage: z.string().describe('ONLY when the user answers the LAST quiz INCORRECTLY Or if they avoid the question'),
                }),
                execute: async () => {
                    console.log('MINUS POINTS')
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

async function giveQuestion() {
    const questions = await db
        .select()
        .from(question)
        .where(eq(question.characterId, 'bodega_tony'));

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    console.log(JSON.stringify(randomQuestion));
    return JSON.stringify(randomQuestion);
}