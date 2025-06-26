import { REAL_STATIONS } from "~/domain/data/stations";
import type { Station, TrainLine, Train, StationComplex } from "./definitions/types";
import { allLines } from "~/domain/data/lines";
import { COMPLEXES } from "~/domain/data/complexes";


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
    let totalTrainId = 1
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

export function shortestPath(start: Station, end: Station) {
    // train connections = 1 weight, walking = 5 weight

    const adjacency = buildAdjacencyGraph();

    // Dijkstra stuff
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const visited = new Set<string>();

    adjacency.forEach((_, id) => {
        distances.set(id, Infinity);
        previous.set(id, null);
    });
    distances.set(start.id, 0);

    const queue: [string, number][] = [[start.id, 0]];

    while (queue.length) {
        queue.sort((a, b) => a[1] - b[1]);
        const [currentId, currentDist] = queue.shift()!;
        if (visited.has(currentId)) continue;
        visited.add(currentId);

        if (currentId === end.id) break;

        const neighbors = adjacency.get(currentId) ?? [];
        for (const { id: neighborId, weight } of neighbors) {
            if (visited.has(neighborId)) continue;
            const alt = currentDist + weight;
            if (alt < (distances.get(neighborId) ?? Infinity)) {
                distances.set(neighborId, alt);
                previous.set(neighborId, currentId);
                queue.push([neighborId, alt]);
            }
        }
    }

    // reconstruct path
    const pathIds: string[] = [];
    let cur: string | null = end.id;
    if ((previous.get(cur) === null) && start.id !== end.id) {
        // no path found
        return [];
    }
    while (cur) {
        pathIds.unshift(cur);
        cur = previous.get(cur) ?? null;
    }

    const stationMap = buildStationGraph();
    return pathIds.map(id => stationMap.get(id)!).filter(Boolean);
}


type Neighbor = { id: string; weight: number };

let _adjacencyGraph: Map<string, Neighbor[]> | null = null;

export function buildAdjacencyGraph(): Map<string, Neighbor[]> {
    if (_adjacencyGraph) return _adjacencyGraph;

    const adjacency: Map<string, Neighbor[]> = new Map<string, Neighbor[]>();

    REAL_STATIONS.forEach(station => adjacency.set(station.id, []));

    //Train connected Stations
    allLines.forEach(line => {
        const ids = line.line;
        for (let i = 0; i < ids.length - 1; i++) {
            const from = ids[i]!;
            const to = ids[i + 1]!;
            if (!adjacency.has(from) || !adjacency.has(to)) continue;
            adjacency.get(from)!.push({ id: to, weight: 1 });
            adjacency.get(to)!.push({ id: from, weight: 1 });
        }
    });

    //Walking connected stations
    COMPLEXES.forEach(complex => {
        const ids = complex.stationIds;
        for (let i = 0; i < ids.length; i++) {
            for (let j = i + 1; j < ids.length; j++) {
                const from = ids[i]!;
                const to = ids[j]!;
                if (!adjacency.has(from) || !adjacency.has(to)) continue;
                adjacency.get(from)!.push({ id: to, weight: 5 });
                adjacency.get(to)!.push({ id: from, weight: 5 });
            }
        }
    });

    _adjacencyGraph = adjacency;
    return adjacency;
}

//maybe this should be a map?? maybe all my maps should get built and stored in gamestate?
export function findStationByName(name: string): { station: Station | null; ambiguous: boolean } {
    const needle = name.trim().toLowerCase();
    if (!needle) return { station: null, ambiguous: false };

    const matches = REAL_STATIONS.filter(st => st.name.toLowerCase() === needle);
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
