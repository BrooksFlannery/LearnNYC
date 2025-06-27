import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { db } from '~/db/drizzle'
import { character, question } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { shortestPath, findStationByName } from '~/lib/stationUtils';
import { gameStore } from '~/server/stores/game';

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

    async function giveDirections(location: string) {

        const { station: dest, ambiguous } = findStationByName(location);

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


        const game = gameStore.getState();
        const start = game.currentStation;
        console.log(game)

        const path = shortestPath(start, dest);

        if (path.length === 0) {
            return `I couldn't find a route from ${start.name} to ${dest.name}.`;
        }
        console.log(path)

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
                    location: z.string().describe('The location name only. For example: "Central Park", "Prospect Ave", "Union Square"'),
                }),
                execute: async ({ location }) => {
                    console.log("asked for directions to", location);
                    return giveDirections(location)
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