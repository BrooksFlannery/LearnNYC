import { buildStationGraph, seedTrains, isTrainAtTerminus, getNextStationOnLine } from "~/lib/stationUtils";
import { randomUUID } from "crypto";
import type { GameState, Station, Train, TrainLine } from "~/lib/definitions/types";
import { GOD_MODE } from "~/lib/godMode";

const stationMap = buildStationGraph();
// Build line graph once (may be useful for future functions)
//does that actually make sense in a serverless environment?

export function createNewGame(): GameState {
    const middleVillage = stationMap.get("station-748");
    const myrtleWyckoff = stationMap.get("station-702");
    if (!middleVillage || !myrtleWyckoff) {
        throw new Error("Seed stations not found in graph");
    }

    const trains = seedTrains();

    return {
        turnNumber: 0,
        currentStation: middleVillage,
        destinationStation: myrtleWyckoff,
        reputation: 0,
        playerMode: "station",
        currentTrain: null,
        trains,
        currentCharacterId: null,
    };
}


export function advanceTurn(state: GameState): GameState {
    return { ...state, turnNumber: state.turnNumber + 1 };
}

export function makeMove(state: GameState, nextStationId: string): GameState {
    const nextStation = stationMap.get(nextStationId);
    if (!nextStation) return state;

    if (!GOD_MODE) {
        const currentComplex = state.currentStation.complexId;
        const nextComplex = nextStation.complexId;
        if (!currentComplex || currentComplex !== nextComplex) return state;
    }

    return {
        ...state,
        currentStation: nextStation,
        turnNumber: state.turnNumber + 1,
    };
}

export function boardTrain(state: GameState, trainId: string): GameState {
    const train = state.trains.find((t) => t.id === trainId);
    if (!train) return state;

    // Must be at the player's station and not a terminating train
    if (train.currentStation.id !== state.currentStation.id) return state;
    if (isTrainAtTerminus(train)) return state;

    return {
        ...state,
        currentTrain: train,
        playerMode: "train",
        turnNumber: state.turnNumber + 1,
    };
}

export function exitTrain(state: GameState): GameState {
    if (!state.currentTrain) return state;
    return {
        ...state,
        currentStation: state.currentTrain.currentStation,
        currentTrain: null,
        playerMode: "station",
        turnNumber: state.turnNumber + 1,
    };
}

function generateTrainId() {
    return `train-${randomUUID()}`;
}

export function tickTrains(state: GameState): GameState {
    const updatedTrains: Train[] = [];

    state.trains.forEach((train) => {
        if (train.isAtStation) {
            // Train is currently at a station – determine if it departs this turn
            const nextTurn = train.nextArrivalTurn - 1;
            if (nextTurn > 0) {
                // Still waiting at station
                updatedTrains.push({ ...train, nextArrivalTurn: nextTurn });
                return;
            }

            // Depart now – remain at current station coordinates but flag as in-transit
            updatedTrains.push({
                ...train,
                isAtStation: false,
                nextArrivalTurn: 0, // will arrive next turn
            });
            return;
        }

        // Train is in transit – time to arrive at the next station
        const nextStation = getNextStationOnLine(train.currentStation, train.line);

        // End-of-line handling
        if (!nextStation) {
            const firstId = train.line.line[0];
            const firstStation = firstId ? stationMap.get(firstId) : undefined;
            if (firstStation) {
                updatedTrains.push({
                    currentStation: firstStation,
                    nextArrivalTurn: 1,
                    line: train.line,
                    id: generateTrainId(),
                    isAtStation: true,
                });
            }
            return;
        }

        updatedTrains.push({
            ...train,
            currentStation: { ...nextStation },
            nextArrivalTurn: 1,
            isAtStation: true,
        });
    });

    // update player if on a train that just moved
    let newState: GameState = { ...state, trains: updatedTrains };
    if (state.currentTrain) {
        const updatedTrain = updatedTrains.find((train) => train.id === state.currentTrain!.id);
        if (updatedTrain) {
            newState = {
                ...newState,
                currentTrain: updatedTrain,
                currentStation: updatedTrain.currentStation,
            };
        } else {
            //kickplayer off at end of line
            newState = {
                ...newState,
                currentTrain: null,
                playerMode: "station",
                currentStation: state.currentTrain.currentStation,
            };
        }
    }

    return newState;
}

// Removed local helper – use shared getNextStationOnLine instead. 