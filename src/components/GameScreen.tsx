'use client';

import { useMemo, useState } from 'react';
import { GOD_MODE } from '~/lib/godMode';
import { Info } from 'lucide-react';
import type { GameManager, Station } from '~/lib/definitions/types';
import { buildLineGraph, buildStationGraph, computeArrivalsForStation, buildComplexGraph } from '~/lib/stationUtils';
import { useGodMode } from '~/contexts/GodModeContext';

export default function GameScreen({ gameManager }: { gameManager: GameManager }) {
    const { showStationNames, toggleStationNames } = useGodMode();

    const [teleportInput, setTeleportInput] = useState('');

    const stationMap = useMemo(() => buildStationGraph(), []);
    const complexMap = useMemo(() => buildComplexGraph(), []);

    const lineMap = useMemo(() => buildLineGraph(), []);

    const arrivals = useMemo(() => {
        if (!gameManager.game) return [];
        return computeArrivalsForStation(
            gameManager.game.currentStation,
            gameManager.game.trains,
            lineMap
        );
    }, [gameManager.game, lineMap]);

    if (GOD_MODE && gameManager.game) {
        const station = gameManager.game.currentStation;
        const complexId = station.complexId ?? 'N/A';

        const complex = complexId !== 'N/A' ? complexMap.get(complexId) : undefined;
        const complexStations = complex
            ? complex.stationIds.map(id => stationMap.get(id)).filter(Boolean)
            : [];

        return (
            <div className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border space-y-1 text-sm w-64">
                <div className="flex items-center gap-2 font-semibold"><Info className="h-4 w-4" /> God Mode – Station Info</div>
                <div><span className="font-medium">Name:</span> {station.name}</div>
                <div><span className="font-medium">ID:</span> {station.id}</div>
                <details className="mt-1">
                    <summary className="cursor-pointer select-none font-medium">Complex: {complexId}</summary>
                    {complexStations.length > 0 ? (
                        <ul className="pl-4 list-disc text-xs space-y-0.5 mt-1">
                            {complexStations.map(cs => (
                                <li key={cs!.id}>{cs!.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-xs italic mt-1 pl-2">No complex data</div>
                    )}
                </details>
                {/* Teleport controls */}
                <div className="mt-2 space-y-1">
                    <input
                        type="text"
                        placeholder="Station name or id"
                        value={teleportInput}
                        onChange={(e) => setTeleportInput(e.target.value)}
                        className="w-full border rounded px-2 py-1 text-xs"
                    />
                    <button
                        onClick={() => {
                            const query = teleportInput.trim();
                            if (!query) return;
                            let target: Station | undefined = stationMap.get(query);
                            if (!target) {
                                const lower = query.toLowerCase();
                                target = Array.from(stationMap.values()).find(s => s.name.toLowerCase() === lower);
                            }
                            if (target) {
                                gameManager.makeMove(target);
                                setTeleportInput('');
                            } else {
                                alert('Station not found');
                            }
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 rounded text-xs"
                    >
                        Teleport
                    </button>
                </div>
                <button onClick={toggleStationNames} className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs">
                    {showStationNames ? 'Hide Station Names' : 'Show Station Names'}
                </button>
            </div>
        );
    }

    if (!gameManager.game) {
        return <div>Loading Spinner...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Walkable Stations panel */}
            {!gameManager.game.currentTrain && (() => {
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
                                    className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded w-full text-left"
                                    onClick={() => gameManager.makeMove(station)}
                                >
                                    {`Walk to ${station.name}`}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })()}


            {/* Upcoming arrivals panel */}
            {gameManager.game.playerMode === 'station' &&
                < div className="bg-white p-4 rounded-lg shadow-lg border-2">
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
                        <div className="bg-white p-4 rounded-lg shadow-lg border-2 mt-4">
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