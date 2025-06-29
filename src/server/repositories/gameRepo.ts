import { db } from "~/db/drizzle";
import { gameState } from "~/db/schema";
import { eq } from "drizzle-orm";
import type { GameState } from "~/lib/definitions/types";

async function fetchByUserId(userId: string): Promise<GameState | undefined> {
    const rows = await db
        .select({ state: gameState.state })
        .from(gameState)
        .where(eq(gameState.userId, userId))
        .limit(1);

    const row = rows[0];
    if (!row) return undefined;

    const raw = row.state;
    const state: GameState = typeof raw === "string"
        ? (JSON.parse(raw) as unknown as GameState)
        : (raw as GameState);
    return state;
}

async function save(userId: string, state: GameState): Promise<void> {
    const existing = await db
        .select({ id: gameState.id })
        .from(gameState)
        .where(eq(gameState.userId, userId))
        .limit(1);

    const serialized = JSON.stringify(state);

    if (existing.length) {
        await db
            .update(gameState)
            .set({ state: serialized, updatedAt: new Date() })
            .where(eq(gameState.userId, userId));
    } else {
        await db.insert(gameState).values({
            userId,
            state: serialized,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}

export const gameRepo = {
    fetchByUserId,
    save,
} as const; 