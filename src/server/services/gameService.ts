import {
    createNewGame,
    makeMove as engineMakeMove,
    boardTrain as engineBoardTrain,
    exitTrain as engineExitTrain,
    advanceTurn as engineAdvanceTurn,
    tickTrains,
} from "~/domain/game/engine";
import type { GameState } from "~/lib/definitions/types";
import { gameRepo } from "~/server/repositories/gameRepo";
import { db } from "~/db/drizzle";
import { character as characterTable } from "~/db/schema";

async function getRandomCharacterId(): Promise<string | null> {
    const characters = await db.select({ id: characterTable.id }).from(characterTable);
    if (!characters.length) return null;
    const randomIdx = Math.floor(Math.random() * characters.length);
    return characters[randomIdx]!.id;
}

async function ensureState(userId: string): Promise<GameState> {
    const existing = await gameRepo.fetchByUserId(userId);
    if (existing) {
        if (!existing.currentCharacterId) {
            existing.currentCharacterId = await getRandomCharacterId();
            await gameRepo.save(userId, existing);
        }
        return existing;
    }

    const fresh = createNewGame();
    fresh.currentCharacterId = await getRandomCharacterId();
    await gameRepo.save(userId, fresh);
    return fresh;
}

export const gameService = {
    async getState(userId: string): Promise<GameState> {
        if (!userId) {
            throw new Error("Authenticated user required");
        }
        try {
            return await ensureState(userId);
        } catch (err) {
            console.error("gameService.getState error", err);
            throw err;
        }
    },

    async makeMove(userId: string, nextStationId: string) {
        if (!userId) throw new Error("Authenticated user required");
        const prev = await ensureState(userId);
        const next = tickTrains(engineMakeMove(prev, nextStationId));
        next.currentCharacterId = await getRandomCharacterId();
        await gameRepo.save(userId, next);
        return next;
    },

    async boardTrain(userId: string, trainId: string) {
        if (!userId) throw new Error("Authenticated user required");
        const prev = await ensureState(userId);
        const next = tickTrains(engineBoardTrain(prev, trainId));
        next.currentCharacterId = await getRandomCharacterId();
        await gameRepo.save(userId, next);
        return next;
    },

    async exitTrain(userId: string) {
        if (!userId) throw new Error("Authenticated user required");
        const prev = await ensureState(userId);
        const next = tickTrains(engineExitTrain(prev));
        next.currentCharacterId = await getRandomCharacterId();
        await gameRepo.save(userId, next);
        return next;
    },

    async advanceTurn(userId: string) {
        if (!userId) throw new Error("Authenticated user required");
        const prev = await ensureState(userId);
        const next = tickTrains(engineAdvanceTurn(prev));
        await gameRepo.save(userId, next);
        return next;
    },

    // Reset the game back to a fresh state (dev helper)
    async resetGame(userId: string) {
        if (!userId) throw new Error("Authenticated user required");
        const fresh = createNewGame();
        fresh.currentCharacterId = await getRandomCharacterId();
        await gameRepo.save(userId, fresh);
        return fresh;
    },
} as const; 