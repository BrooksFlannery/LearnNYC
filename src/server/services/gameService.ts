import {
    createNewGame,
    makeMove as engineMakeMove,
    boardTrain as engineBoardTrain,
    exitTrain as engineExitTrain,
    advanceTurn as engineAdvanceTurn,
    tickTrains,
} from "~/domain/game/engine";
import type { GameState } from "~/lib/definitions/types";
import { gameRepo, DEFAULT_USER } from "~/server/repositories/gameRepo";

async function ensureState(userId: string): Promise<GameState> {
    const existing = await gameRepo.fetchByUserId(userId);
    if (existing) return existing;

    const fresh = createNewGame();
    await gameRepo.save(userId, fresh);
    return fresh;
}

export const gameService = {
    async getState(userId?: string): Promise<GameState> {
        const key = userId ?? DEFAULT_USER;
        try {
            return await ensureState(key);
        } catch (err) {
            console.error("gameService.getState error", err);
            throw err;
        }
    },

    async makeMove(userId: string | undefined, nextStationId: string) {
        const key = userId ?? DEFAULT_USER;
        const prev = await ensureState(key);
        const next = tickTrains(engineMakeMove(prev, nextStationId));
        await gameRepo.save(key, next);
        return next;
    },

    async boardTrain(userId: string | undefined, trainId: string) {
        const key = userId ?? DEFAULT_USER;
        const prev = await ensureState(key);
        const next = tickTrains(engineBoardTrain(prev, trainId));
        await gameRepo.save(key, next);
        return next;
    },

    async exitTrain(userId?: string) {
        const key = userId ?? DEFAULT_USER;
        const prev = await ensureState(key);
        const next = tickTrains(engineExitTrain(prev));
        await gameRepo.save(key, next);
        return next;
    },

    async advanceTurn(userId?: string) {
        const key = userId ?? DEFAULT_USER;
        const prev = await ensureState(key);
        const next = tickTrains(engineAdvanceTurn(prev));
        await gameRepo.save(key, next);
        return next;
    },
} as const; 