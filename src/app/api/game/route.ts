import { NextRequest } from "next/server";
import { z } from "zod";
import { gameStore } from "~/server/stores/game";
import type { GameAction } from "~/domain/game/engine";

const ActionSchema = z.discriminatedUnion("type", [
    z.object({ type: z.literal("advanceTurn") }),
    z.object({ type: z.literal("makeMove"), nextStationId: z.string() }),
    z.object({ type: z.literal("boardTrain"), trainId: z.string() }),
    z.object({ type: z.literal("exitTrain") }),
    z.object({ type: z.literal("noop") }),
]);

export async function GET() {
    const state = gameStore.getState();
    return Response.json(state);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const parse = ActionSchema.safeParse(body);
    if (!parse.success) {
        return new Response("Invalid action", { status: 400 });
    }
    const action: GameAction = parse.data;

    const nextState = gameStore.dispatch(undefined, action);
    return Response.json(nextState);
} 