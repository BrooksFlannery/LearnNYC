'use client';

import { useMemo } from 'react';
import { buildLineGraph, computeArrivalsForStation, isTrainAtTerminus } from "~/lib/stationUtils";
import type { GameManager } from "~/lib/definitions/types";

export default function ArrivalsPanel({ gameManager }: { gameManager: GameManager }) {
    const lineMap = useMemo(() => buildLineGraph(), []);

    const arrivals = useMemo(() => {
        if (!gameManager.game) return [];
        return computeArrivalsForStation(
            gameManager.game.currentStation,
            gameManager.game.trains,
            lineMap
        );
    }, [gameManager.game, lineMap]);

    if (!gameManager.game || gameManager.game.playerMode !== 'station') return null;

    const currentStationId = gameManager.game.currentStation.id;

    const visibleArrivals = arrivals.filter(info => {
        const lineTerminusId = info.line.line[info.line.line.length - 1];
        return lineTerminusId !== currentStationId; // hide trains whose run ends here
    });

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg border-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Arrivals</h2>
            {visibleArrivals.length === 0 ? (
                <p className="text-gray-700">No scheduled trains found.</p>
            ) : (
                <div className="space-y-1 text-gray-800">
                    {visibleArrivals.map(info => {
                        const displayTurns = Math.max(0, info.arrivalTurns - 1);
                        if (displayTurns === 0) {
                            if (isTrainAtTerminus(info.train)) return null;
                            return (
                                <button
                                    key={`${info.train.id}-${info.line.id}`}
                                    className="bg-green-400 hover:bg-green-500 text-white px-2 py-1 rounded"
                                    onClick={() => gameManager.boardTrain(info.train)}
                                >
                                    {`Arriving – ${info.line.name} (board)`}
                                </button>
                            );
                        }
                        const turnsLabel = `${displayTurns} turn${displayTurns === 1 ? '' : 's'}`;
                        return (
                            <div key={`${info.train.id}-${info.line.id}`}>{`${turnsLabel} – ${info.line.name}`}</div>
                        );
                    })}
                </div>
            )}
        </div>
    );
} 