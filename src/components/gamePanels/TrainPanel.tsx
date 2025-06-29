'use client';

import { useMemo } from 'react';
import type { GameManager, Station } from "~/lib/definitions/types";
import { buildStationGraph } from "~/lib/stationUtils";

export default function TrainPanel({ gameManager }: { gameManager: GameManager }) {
    if (!gameManager.game || gameManager.game.playerMode !== 'train' || !gameManager.game.currentTrain) return null;

    const stationMap = useMemo(() => buildStationGraph(), []);

    const train = gameManager.game.currentTrain;
    const line = train.line;
    const currentIdx = line.line.findIndex(id => id === train.currentStation.id);
    const lastIdx = line.line.length - 1;

    const upcomingStops: { station: Station; distance: number }[] = [];
    upcomingStops.push({ station: train.currentStation, distance: 0 });

    for (let offset = 1; offset <= 2; offset++) {
        const idx = currentIdx + offset;
        if (idx >= line.line.length) break;
        const stId = line.line[idx];
        if (!stId) break;
        const st = stationMap.get(stId);
        if (st) upcomingStops.push({ station: st, distance: offset });
    }

    if (lastIdx > currentIdx) {
        const finalDistance = lastIdx - currentIdx;
        const finalStationId = line.line[lastIdx];
        if (finalStationId) {
            const finalStation = stationMap.get(finalStationId);
            if (finalStation) {
                const alreadyIncluded = upcomingStops.some(s => s.station.id === finalStation.id);
                if (!alreadyIncluded) {
                    upcomingStops.push({ station: finalStation, distance: finalDistance });
                }
            }
        }
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg border-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Stops</h2>
            {upcomingStops.length === 0 ? (
                <p className="text-gray-700">End of line.</p>
            ) : (
                <div className="space-y-1 text-gray-800">
                    {upcomingStops.map(info => {
                        if (info.distance === 0) {
                            return (
                                <button
                                    key={info.station.id}
                                    className="bg-green-400 hover:bg-green-500 text-white px-2 py-1 rounded"
                                    onClick={() => gameManager.exitTrain(train)}
                                >
                                    {`Arriving – ${info.station.name} (exit)`}
                                </button>
                            );
                        }
                        return (
                            <div key={info.station.id}>{`${info.distance} turn${info.distance === 1 ? '' : 's'} – ${info.station.name}`}</div>
                        );
                    })}
                </div>
            )}
        </div>
    );
} 