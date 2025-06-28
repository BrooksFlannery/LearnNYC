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

async function ensureState(userId: string): Promise<GameState> {
    const existing = await gameRepo.fetchByUserId(userId);
    if (existing) return existing;

    const fresh = createNewGame();
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
        await gameRepo.save(userId, next);
        return next;
    },

    async boardTrain(userId: string, trainId: string) {
        if (!userId) throw new Error("Authenticated user required");
        const prev = await ensureState(userId);
        const next = tickTrains(engineBoardTrain(prev, trainId));
        await gameRepo.save(userId, next);
        return next;
    },

    async exitTrain(userId: string) {
        if (!userId) throw new Error("Authenticated user required");
        const prev = await ensureState(userId);
        const next = tickTrains(engineExitTrain(prev));
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
} as const; 