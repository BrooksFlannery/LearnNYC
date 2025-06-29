'use client';

import { useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import { GOD_MODE } from "~/lib/godMode";
import { buildStationGraph, buildComplexGraph } from "~/lib/stationUtils";
import type { GameManager, Station } from "~/lib/definitions/types";
import { useGodMode } from "~/contexts/GodModeContext";

export default function GodModeOverlay({ gameManager }: { gameManager: GameManager }) {
    const { showStationNames, toggleStationNames } = useGodMode();
    const [teleportInput, setTeleportInput] = useState('');

    const stationMap = useMemo(() => buildStationGraph(), []);
    const complexMap = useMemo(() => buildComplexGraph(), []);

    if (!GOD_MODE || !gameManager.game) return null;

    const station = gameManager.game.currentStation;
    const complexId = station.complexId ?? 'N/A';
    const complex = complexId !== 'N/A' ? complexMap.get(complexId) : undefined;
    const complexStations = complex ? complex.stationIds.map(id => stationMap.get(id)).filter(Boolean) : [];

    return (
        <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border space-y-1 text-sm w-64">
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

            {/* Reset game state */}
            <button
                onClick={gameManager.resetGame}
                className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs"
            >
                Reset Game
            </button>

            <button
                onClick={toggleStationNames}
                className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs"
            >
                {showStationNames ? 'Hide Station Names' : 'Show Station Names'}
            </button>
        </div>
    );
} 