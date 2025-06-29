import { REAL_STATIONS } from "~/domain/data/stations";
import { allLines } from "~/domain/data/lines";
import { COMPLEXES } from "~/domain/data/complexes";
import type { Station, TrainLine, StationComplex } from "~/lib/definitions/types";

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