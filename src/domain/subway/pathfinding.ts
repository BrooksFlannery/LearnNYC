import { REAL_STATIONS } from "~/domain/data/stations";
import { allLines } from "~/domain/data/lines";
import { COMPLEXES } from "~/domain/data/complexes";
import type { Station } from "~/lib/definitions/types";
import { buildStationGraph } from "./graph";

// Edge type for adjacency graph weights
export type Neighbor = { id: string; weight: number };

let _adjacencyGraph: Map<string, Neighbor[]> | null = null;

export function buildAdjacencyGraph(): Map<string, Neighbor[]> {
    if (_adjacencyGraph) return _adjacencyGraph;

    const adjacency: Map<string, Neighbor[]> = new Map<string, Neighbor[]>();

    REAL_STATIONS.forEach(station => adjacency.set(station.id, []));

    // Train-connected stations (weight 1)
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

    // Walking transfers inside complexes (weight 3)
    COMPLEXES.forEach(complex => {
        const ids = complex.stationIds;
        for (let i = 0; i < ids.length; i++) {
            for (let j = i + 1; j < ids.length; j++) {
                const from = ids[i]!;
                const to = ids[j]!;
                if (!adjacency.has(from) || !adjacency.has(to)) continue;
                adjacency.get(from)!.push({ id: to, weight: 3 });
                adjacency.get(to)!.push({ id: from, weight: 3 });
            }
        }
    });

    _adjacencyGraph = adjacency;
    return adjacency;
}

// Dijkstra shortest-path over the adjacency graph.
export function shortestPath(start: Station, end: Station): Station[] {
    const adjacency = buildAdjacencyGraph();

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

    // Reconstruct path
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