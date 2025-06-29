import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { db } from '~/db/drizzle'
import { question } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { shortestPath, findStationByName } from '~/lib/stationUtils';
import { gameService } from '~/server/services/gameService';
import { auth } from '~/lib/auth';

export const maxDuration = 30;

const messageSchema = z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
    id: z.string().optional(),
});

const bodySchema = z.object({
    characterId: z.string(),
    messages: z.array(messageSchema),
});

export async function POST(req: Request) {

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
        return new Response("Unauthenticated", { status: 401 });
    }

    const userId = session.user.id;

    const { messages, characterId } = bodySchema.parse(await req.json());

    async function giveQuestion() {

        const questions = await db
            .select()
            .from(question)
            .where(eq(question.characterId, characterId));

        if (!questions || questions.length === 0) {
            return 'Actually im all out of questions, you win!';
        }

        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        return JSON.stringify(randomQuestion);
    }

    async function giveDirections(location: string) {

        const { station: dest, ambiguous } = findStationByName(location);

        //we should maybe search through array of stations once we refactor to allow for arrays and ask which line they are talking about specifically(must eliminate complex over lap though)
        if (ambiguous) {
            return `There are multiple stations named "${location}" on different lines. Could you be more specific?`;
        }

        //we really need some fuzzy logic system for finding station names? 
        //maybe like give an ai the string input and compare agains all station names???
        //this is super brittle to typos or my poorly named Stations?
        //also i think i need to change the way i do station names? or station lines? if i want to be able to lookup
        if (!dest) {
            return `Hmm, I don't know any station called "${location}".`;
        }

        const game = await gameService.getState(userId);
        const start = game.currentStation;

        const path = shortestPath(start, dest);

        if (path.length === 0) {
            return `I couldn't find a route from ${start.name} to ${dest.name}.`;
        }

        const route = path.map(s => s.name).join(' → ');
        return `From ${start.name}, take the following route: ${route}. Good luck!`;
    }

    const result = streamText({
        model: openai('gpt-4o-mini'),
        messages,
        maxSteps: 2,
        tools: {
            giveDirections: tool({
                //when and why to call this tool
                description: "Call this when a user asks for directions. Pass ONLY the location name as userMessage",
                //shape and type of data the tool expects
                parameters: z.object({
                    location: z.string().describe('The location name only. For example: "Myrtle-Wyckoff Avs", "De Kalb Av", "Myrtle Av-Broadway"'),
                }),
                execute: async ({ location }) => {
                    return giveDirections(location)
                }
            }),
            correctQuiz: tool({
                description: "ONLY call this when a user answers the LAST quiz CORRECTLY ",
                parameters: z.object({
                    userMessage: z.string().describe('ONLY when the user answers the LAST quiz CORRECTLY'),
                }),
                execute: async () => {
                    return giveQuestion()
                }
            }),
            incorrectQuiz: tool({
                description: "ONLY call this when a user answers the LAST quiz INCORRECTLY ONLY",
                parameters: z.object({
                    userMessage: z.string().describe('ONLY when the user answers the LAST quiz INCORRECTLY'),
                }),
                execute: async () => {
                    return giveQuestion();
                }
            }),
            exitQuiz: tool({
                description: "ONLY call this when a user avoids or tries to quit the quiz. we respond with a new quiz",
                parameters: z.object({
                    userMessage: z.string().describe('ONLY when the user avoids or tries to quit the quiz. we respond with a new quiz'),
                }),
                execute: async () => {
                    return giveQuestion();
                }
            }),
            giveQuiz: tool({
                description: "after asks for a quiz",
                parameters: z.object({
                    userMessage: z.string().describe('user asks for a quiz'),
                }),
                execute: async () => {
                    return giveQuestion();
                }
            })
        },
    });

    return result.toDataStreamResponse();
}