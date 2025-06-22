import {
    createNewGame,
    makeMove as engineMakeMove,
    boardTrain as engineBoardTrain,
    exitTrain as engineExitTrain,
    advanceTurn as engineAdvanceTurn,
    tickTrains,
} from "~/domain/game/engine";
import type { GameState } from "~/lib/definitions/types";

const store = new Map<string, GameState>();
const DEFAULT_USER = "anonymous";//auth is fucked fix later

const key = DEFAULT_USER;

export const gameStore = {
    getState(userId?: string): GameState {
        let state = store.get(key);
        if (!state) {
            state = createNewGame();
            store.set(key, state);
        }
        return state;
    },

    makeMove(userId: string | undefined, nextStationId: string): GameState {
        const prev = this.getState(key);
        const next = tickTrains(engineMakeMove(prev, nextStationId));
        store.set(key, next);
        return next;
    },

    boardTrain(userId: string | undefined, trainId: string): GameState {
        const prev = this.getState(key);
        const next = tickTrains(engineBoardTrain(prev, trainId));
        store.set(key, next);
        return next;
    },

    exitTrain(userId?: string): GameState {
        const prev = this.getState(key);
        const next = tickTrains(engineExitTrain(prev));
        store.set(key, next);
        return next;
    },

    advanceTurn(userId?: string): GameState {
        const prev = this.getState(key);
        const next = tickTrains(engineAdvanceTurn(prev));
        store.set(key, next);
        return next;
    },
} as const; 