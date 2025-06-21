
import { useEffect, useMemo, useState } from "react";
import type { GameManager, GameState, Station, Train, TrainLine } from "~/lib/definitions/types";
import { buildStationGraph, buildLineGraph, seedTrains } from "~/lib/stationUtils";

export function useGame(): GameManager {
    const stationMap = useMemo(() => buildStationGraph(), []);
    const lineMap = useMemo(() => buildLineGraph(), [])
    const [game, setGame] = useState<GameState | null>(null);
    const [trains, setTrains] = useState<Train[]>([]);


    useEffect(() => {
        const middleVillage = stationMap.get("station-748");
        const myrtleWyckoff = stationMap.get("station-702");
        const mLine = lineMap.get("line-25");

        if (!middleVillage || !myrtleWyckoff || !mLine) return;

        const initialTrains = seedTrains()

        setGame({
            turnNumber: 0,
            currentStation: middleVillage,
            destinationStation: myrtleWyckoff,
            reputation: 0,
            playerMode: 'station',
            currentTrain: null,
            trains: initialTrains
        });

        setTrains(initialTrains);
    }, [stationMap]);

    useEffect(() => {
        if (!game || game.turnNumber === 0) return;
        incrementTrains();
    }, [game?.turnNumber]);

    useEffect(() => {
        setGame(prev => {
            if (!prev) return prev;

            let nextState: GameState = { ...prev, trains }; // always sync trains

            if (prev.currentTrain) {
                const currentTrainId = prev.currentTrain.id;
                const updatedTrain = trains.find(t => t.id === currentTrainId);
                if (updatedTrain && updatedTrain.isAtStation) {
                    nextState = {
                        ...nextState,
                        currentTrain: updatedTrain,
                        currentStation: updatedTrain.currentStation,
                    };
                } else if (!updatedTrain || !updatedTrain.isAtStation) {
                }
            }

            return nextState;
        });
    }, [trains]);

    function incrementTrains() {
        setTrains(prevTrains =>
            prevTrains.map(train => {
                const nextTurn = train.nextArrivalTurn - 1;
                if (nextTurn > 0) {
                    return { ...train, nextArrivalTurn: nextTurn, isAtStation: false };
                }

                const nextStation = getNextStationFromLine(train.currentStation, train.line);
                if (!nextStation) {
                    const playerStopStation = train.currentStation;
                    const firstStation = stationMap.get(train.line.line[0]);

                    if (train === game?.currentTrain) exitTrain({ ...train, currentStation: playerStopStation });


                    return {
                        ...train,
                        currentStation: firstStation!,
                        nextArrivalTurn: 1,
                        isAtStation: true,
                    };
                }

                return {
                    ...train,
                    currentStation: { ...nextStation },
                    nextArrivalTurn: 1,
                    isAtStation: true,
                };
            })
        );
    }

    function getNextStationFromLine(currentStation: Station, trainLine: TrainLine): Station | null {
        const idx = trainLine.line.findIndex(id => stationMap.get(id)?.id === currentStation.id);
        if (idx === -1 || idx + 1 >= trainLine.line.length) return null;
        const nextStation = trainLine.line[idx + 1]
        if (!nextStation) return null
        return stationMap.get(nextStation) ?? null;
    }

    function advanceTurn() {
        if (!game) return;
        setGame(prev => prev ? { ...prev, turnNumber: prev.turnNumber + 1 } : prev);
    }

    function makeMove(next: Station) {
        if (!game || !game.currentStation.walkable?.includes(next.id)) return;
        setGame(prev => prev ? { ...prev, currentStation: next } : prev);
        advanceTurn();
    }
    function boardTrain(train: Train) {
        setGame(prev => prev ? { ...prev, currentTrain: train, playerMode: 'train' } : prev);
        advanceTurn();
    }
    function exitTrain(train: Train) {
        setGame(prev => prev ? {
            ...prev,
            currentTrain: null,
            playerMode: 'station',
            currentStation: train.currentStation
        } : prev);
        advanceTurn();
    }

    return {
        game,
        makeMove,
        exitTrain,
        boardTrain,
        advanceTurn,
    };
}
