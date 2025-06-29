import { REAL_STATIONS } from "~/domain/data/stations";
import { allLines } from "~/domain/data/lines";
import type { Train, TrainLine } from "~/lib/definitions/types";

function seedTrain(line: TrainLine, stationIndex: number): Train {
    const stationId = line.line[stationIndex];
    const newTrain: Train = {
        currentStation: REAL_STATIONS.find(station => station.id === stationId)!,
        nextArrivalTurn: 1,
        line: line,
        id: `train-${typeof globalThis !== 'undefined' && globalThis.crypto && 'randomUUID' in globalThis.crypto ? (globalThis.crypto).randomUUID() : Math.random().toString(36).slice(2)}`,
        isAtStation: true,
    };
    return newTrain;
}

export function seedTrains(): Train[] {
    const totalTrains: Train[] = [];
    const minSkip = 5;
    const maxSkip = 8;

    allLines.forEach((line) => {
        totalTrains.push(seedTrain(line, 0));

        let currentStationIndex = 0;
        while (currentStationIndex < line.line.length - 1) {
            const skip = Math.floor(Math.random() * (maxSkip - minSkip + 1)) + minSkip;
            currentStationIndex += skip;

            if (currentStationIndex < line.line.length) {
                totalTrains.push(seedTrain(line, currentStationIndex));
            }
        }
    });

    return totalTrains;
}

// Returns true if the train is currently sitting at the last station on its line.
export function isTrainAtTerminus(train: Train): boolean {
    const lastStationId = train.line.line[train.line.line.length - 1];
    return train.currentStation.id === lastStationId;
} 