export * from "~/domain/subway/graph";
export * from "~/domain/subway/train";
export * from "~/domain/subway/lookup";
export * from "~/domain/subway/pathfinding";

import type { Station, TrainLine } from "~/lib/definitions/types";
import { buildStationGraph } from "~/domain/subway/graph";

// Cached station map for quick look-ups
const _stationMap = buildStationGraph();

/**
 * Returns the next station on a given train line, or null if the train is at the final stop.
 */
export function getNextStationOnLine(currentStation: Station, trainLine: TrainLine): Station | null {
    const idx = trainLine.line.findIndex(id => id === currentStation.id);
    if (idx === -1) return null;
    const nextIdx = idx + 1;
    if (nextIdx >= trainLine.line.length) return null;
    const nextId = trainLine.line[nextIdx];
    return nextId ? _stationMap.get(nextId) ?? null : null;
} 