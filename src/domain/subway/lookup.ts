import { REAL_STATIONS } from "~/domain/data/stations";
import type { Station, TrainLine, Train } from "~/lib/definitions/types";

export function getRandomStationPair(): { start: Station; end: Station } {
    const stations = REAL_STATIONS;
    const start = stations[Math.floor(Math.random() * stations.length)]!;
    let end = stations[Math.floor(Math.random() * stations.length)]!;

    while (end.id === start.id) {
        end = stations[Math.floor(Math.random() * stations.length)]!;
    }

    return { start, end };
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

export function findStationByName(name: string): { station: Station | null; ambiguous: boolean } {
    const target = name.trim().toLowerCase();
    if (!target) return { station: null, ambiguous: false };

    const matches = REAL_STATIONS.filter(st => st.name.toLowerCase() === target);
    if (matches.length === 0) {
        return { station: null, ambiguous: false };
    }

    const firstComplex = matches[0]!.complexId;
    const spansMultipleComplexes = matches.some(st => st.complexId !== firstComplex);

    if (spansMultipleComplexes) {
        return { station: null, ambiguous: true };
    }

    return { station: matches[0]!, ambiguous: false };
} 