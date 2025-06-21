'use client';

import { Flag } from 'lucide-react';
import { useMemo } from 'react';
import { REAL_STATIONS } from '~/lib/data/realStations';
import type { GameManager, Station } from '~/lib/definitions/types';
import { buildLineGraph, buildStationGraph, computeArrivalsForStation } from '~/lib/stationUtils';

export default function GameScreen({ gameManager }: { gameManager: GameManager }) {
    if (!gameManager.game) {
        return (
            <div>Loading Spinner...</div>
        )
    }

    const lineMap = useMemo(() => buildLineGraph(), []);
    const stationMap = useMemo(() => buildStationGraph(), []);

    const arrivals = useMemo(() => {
        if (!gameManager.game) return [];
        return computeArrivalsForStation(
            gameManager.game.currentStation,
            gameManager.game.trains,
            lineMap
        );
    }, [gameManager.game, lineMap]);

    return (
        <div className="space-y-6">


            {/* Upcoming arrivals panel */}
            {gameManager.game.playerMode === 'station' &&
                < div className="bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Arrivals</h2>
                    {arrivals.length === 0 ? (
                        <p className="text-gray-700">No scheduled trains found.</p>
                    ) : (
                        <div className="space-y-1 text-gray-800">
                            {arrivals.map(info => {
                                const displayTurns = Math.max(0, info.arrivalTurns - 1);
                                if (displayTurns === 0) {
                                    return (
                                        <button
                                            key={`${info.train.id}-${info.line.id}`}
                                            className="bg-green-400"
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
            }

            {/* Train mode panel*/}
            {gameManager.game.playerMode === 'train' && gameManager.game.currentTrain && (
                (() => {
                    const train = gameManager.game!.currentTrain!;
                    const line = train.line;
                    const currentIdx = line.line.findIndex(id => id === train.currentStation.id);
                    const lastIdx = line.line.length - 1;

                    const upcomingStops: { station: Station; distance: number }[] = [];

                    upcomingStops.push({ station: train.currentStation, distance: 0 });

                    for (let offset = 1; offset <= 2; offset++) {
                        const idx = currentIdx + offset;
                        if (idx >= line.line.length) break;
                        const stId = line.line[idx];
                        if (!stId) return;
                        const st = stationMap.get(stId);
                        if (st) upcomingStops.push({ station: st, distance: offset });
                    }

                    if (lastIdx > currentIdx) {
                        const finalDistance = lastIdx - currentIdx;
                        const finalStationId = line.line[lastIdx];
                        if (!finalStationId) return;
                        const finalStation = stationMap.get(finalStationId);
                        if (finalStation) {
                            const alreadyIncluded = upcomingStops.some(s => s.station.id === finalStation.id);
                            if (!alreadyIncluded) {
                                upcomingStops.push({ station: finalStation, distance: finalDistance });
                            }
                        }
                    }

                    return (
                        <div className="bg-white p-4 rounded-lg shadow-sm mt-4">
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
                                                    className="bg-green-400"
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
                })()
            )}

        </div >
    );
} 