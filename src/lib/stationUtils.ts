import { allLines } from "./data/lines";
import { REAL_STATIONS } from "./data/stations";
import { COMPLEXES } from "./data/complexes";
import type { Station, TrainLine, Train, StationComplex } from "./definitions/types";


export function buildStationGraph(): Map<string, Station> {
    const stationMap = new Map<string, Station>();
    REAL_STATIONS.forEach((station: Station) => {
        stationMap.set(station.id, station);
    });
    return stationMap;
}

export function buildLineGraph(): Map<string, TrainLine> {
    const lineMap = new Map<string, TrainLine>();
    allLines.forEach((line: TrainLine) => {
        lineMap.set(line.id, line);
    });
    return lineMap;
}

export function buildComplexGraph(): Map<string, StationComplex> {
    const complexMap = new Map<string, StationComplex>();
    COMPLEXES.forEach((complex: StationComplex) => {
        complexMap.set(complex.id, complex);
    });
    return complexMap;
}

export function getRandomStationPair(): { start: Station; end: Station } {
    const stations = REAL_STATIONS;
    const start = stations[Math.floor(Math.random() * stations.length)]!;
    let end = stations[Math.floor(Math.random() * stations.length)]!;

    while (end.id === start.id) {
        end = stations[Math.floor(Math.random() * stations.length)]!;
    }

    return { start, end };
}
export function seedTrains(): Train[] {
    const totalTrains: Train[] = []
    let totalTrainId: number = 1
    const minSkip = 5;
    const maxSkip = 8;

    allLines.forEach((line) => {
        totalTrains.push(seedTrain(line, 0, totalTrainId));
        totalTrainId++;

        let currentStationIndex = 0;
        while (currentStationIndex < line.line.length - 1) {
            const skip = Math.floor(Math.random() * (maxSkip - minSkip + 1)) + minSkip;
            currentStationIndex += skip;

            if (currentStationIndex < line.line.length) {
                totalTrains.push(seedTrain(line, currentStationIndex, totalTrainId));
                totalTrainId++;
            }
        }
    });

    return totalTrains;
}

function seedTrain(line: TrainLine, stationIndex: number, id: number): Train {
    const stationId = line.line[stationIndex];
    const newTrain: Train = {
        currentStation: REAL_STATIONS.find(station => station.id === stationId)!,
        nextArrivalTurn: 1,
        line: line,
        id: `train-${id}`,
        isAtStation: true,
    }
    return newTrain
}

export type ArrivalInfo = {
    line: TrainLine;
    train: Train;
    arrivalTurns: number;
};

export function computeArrivalsForStation(
    station: Station,
    trains: Train[],
    lineMap: Map<string, TrainLine>
): ArrivalInfo[] {
    const arrivals: ArrivalInfo[] = [];

    if (!station.lines || station.lines.length === 0) return arrivals;

    for (const lineId of station.lines) {
        const line = lineMap.get(lineId);
        if (!line) continue;

        const stationIdx = line.line.findIndex(id => id === station.id);
        if (stationIdx === -1) continue;

        const lineLength = line.line.length;

        let best: ArrivalInfo | null = null;

        for (const train of trains) {
            if (train.line.id !== line.id || !train.isAtStation) continue;

            const trainIdx = line.line.findIndex(id => id === train.currentStation.id);
            if (trainIdx === -1) continue;

            let distance: number;
            if (trainIdx <= stationIdx) {
                distance = stationIdx - trainIdx;
            } else {
                distance = (lineLength - trainIdx) + stationIdx;
            }

            const arrivalTurns = train.nextArrivalTurn + distance;

            if (!best || arrivalTurns < best.arrivalTurns) {
                best = { line, train, arrivalTurns };
            }
        }

        if (best) arrivals.push(best);
    }

    arrivals.sort((a, b) => a.arrivalTurns - b.arrivalTurns);

    return arrivals;
}

