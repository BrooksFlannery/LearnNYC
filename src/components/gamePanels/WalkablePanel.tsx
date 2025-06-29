'use client';

import { useMemo } from 'react';
import { buildStationGraph, buildComplexGraph } from "~/lib/stationUtils";
import type { GameManager, Station } from "~/lib/definitions/types";

export default function WalkablePanel({ gameManager }: { gameManager: GameManager }) {
    if (!gameManager.game || gameManager.game.currentTrain) return null;

    const stationMap = useMemo(() => buildStationGraph(), []);
    const complexMap = useMemo(() => buildComplexGraph(), []);

    const current = gameManager.game.currentStation;
    const currentComplexId = current.complexId;
    if (!currentComplexId) return null;

    const complex = complexMap.get(currentComplexId);
    if (!complex) return null;

    const walkableStations = complex.stationIds
        .filter(id => id !== current.id)
        .map(id => stationMap.get(id)!)
        .filter((s): s is Station => !!s);

    if (walkableStations.length === 0) return null;

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg border-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Available Platforms</h2>
            <div className="space-y-1 text-gray-800">
                {walkableStations.map((station) => (
                    <button
                        key={station.id}
                        className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded w-full text-left"
                        onClick={() => gameManager.makeMove(station)}
                    >
                        {`Walk to ${station.name}`}
                    </button>
                ))}
            </div>
        </div>
    );
} 