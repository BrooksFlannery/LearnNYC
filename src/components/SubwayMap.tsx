'use client';

import { Flag, MapPin } from "lucide-react";
import { REAL_STATIONS } from "~/domain/data/stations";
import type { GameManager } from "~/lib/definitions/types";
import { GOD_MODE } from "~/lib/godMode";
import { useGodMode } from "~/contexts/GodModeContext";
import { isTrainAtTerminus } from "~/lib/stationUtils";
import PathEditor from "~/components/PathEditor";
import { loadPathMap } from "~/lib/trainPaths";
import { getNextStationOnLine } from "~/lib/stationUtils";
import type { Station } from "~/lib/definitions/types";
import { useState, useEffect } from "react";


export default function SubwayMap({ gameManager }: { gameManager: GameManager }) {

    const ZOOM_WIDTH = 700; // we should allow the users scroll wheel to affect this
    const ZOOM_HEIGHT = 700;

    const trackCoords = gameManager.game?.currentTrain
        ? gameManager.game.currentTrain.currentStation.coordinates
        : gameManager.game?.currentStation.coordinates;

    const translate = trackCoords
        ? {
            x: ZOOM_WIDTH / 2 - trackCoords.x,
            y: ZOOM_HEIGHT / 2 - trackCoords.y,
        }
        : { x: 0, y: 0 };

    const { showStationNames } = useGodMode();

    const [pathMap, setPathMap] = useState<Record<string, any> | null>(null);

    useEffect(() => {
        const pm = loadPathMap();
        setPathMap(pm);
    }, []);

    const segmentId = (a: string, b: string) => [a, b].sort().join("->");

    if (!gameManager.game) {
        return (
            <div>Loadding spinner goes here...</div>
        )
    }

    return (
        <div className="w-full h-full relative">
            {/* Map interaction overlay – top right */}
            {!GOD_MODE && (
                <div className="absolute top-0 right-0 p-4 flex flex-col gap-4 items-end pointer-events-none z-10 w-fit">
                    {/* Current Station */}
                    <div className="w-full flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-lg border-2 backdrop-blur-md pointer-events-auto">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <span className="font-medium text-gray-700 text-sm text-right">
                            Current Station: {gameManager.game.currentStation.name}
                        </span>
                    </div>

                    {/* Goal Station */}
                    <div className="w-full flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-lg border-2 backdrop-blur-md pointer-events-auto">
                        <Flag className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-gray-700 text-sm text-right">
                            Destination: {gameManager.game.destinationStation.name}
                        </span>
                    </div>
                </div>
            )}


            <svg viewBox={`0 0 ${ZOOM_WIDTH} ${ZOOM_HEIGHT}`} className="w-full h-full">
                <g
                    transform={`translate(${translate.x} ${translate.y})`}
                    className="transition-transform duration-700"
                >
                    {/* Subway map base image */}
                    <image href="/nyc_subway_map.svg" x={0} y={0} width={2500} height={2700} />

                    {/* Path editor overlay (only active in God Mode) */}
                    <PathEditor />

                    {/* Draw stations */}
                    {(() => {
                        const currentComplex = gameManager.game.currentStation.complexId;
                        const currentStationId = gameManager.game.currentStation.id;
                        return REAL_STATIONS.map(station => {
                            const isCurrent = station.id === currentStationId;
                            const stationComplex = station.complexId;
                            const isAvailable =
                                !!currentComplex && // only if current station is part of a complex
                                !gameManager.game!.currentTrain &&
                                station.id !== currentStationId &&
                                stationComplex === currentComplex;

                            return (
                                <g
                                    key={station.id}
                                    onClick={() => {
                                        if (GOD_MODE) {
                                            gameManager.makeMove(station);
                                        } else if (isAvailable) {
                                            gameManager.makeMove(station);
                                        }
                                    }}
                                    style={{ cursor: GOD_MODE || isAvailable ? "pointer" : "default" }}
                                >
                                    <circle
                                        cx={station.coordinates.x}
                                        cy={station.coordinates.y}
                                        r={7}
                                        fill={isCurrent || isAvailable ? "#fff" : "#00000000"}
                                        stroke={isCurrent ? "#000000" : "#0000000"}
                                        strokeWidth={2}
                                        className="transition-all duration-200"
                                    />
                                    {GOD_MODE && showStationNames && (
                                        <text
                                            x={station.coordinates.x + 10}
                                            y={station.coordinates.y - 10}
                                            fontSize={10}
                                            fill="#000"
                                            style={{ pointerEvents: 'none' }}
                                        >
                                            {station.name}
                                        </text>
                                    )}
                                </g>
                            );
                        });
                    })()}

                    {/* Draw trains */}
                    {!GOD_MODE && gameManager.game.trains.map(train => {
                        const isAvailable = !isTrainAtTerminus(train) && train.currentStation.id === gameManager.game?.currentStation.id;

                        const SIZE = 10;
                        const from = train.currentStation;
                        const next: Station | null = getNextStationOnLine(from, train.line);

                        // Build offset-path string if we have geometry
                        let offsetPathStyle: React.CSSProperties = {};
                        if (pathMap && next) {
                            const seg = pathMap[segmentId(from.id, next.id)];
                            if (seg) {
                                // Ensure correct direction – reverse points if necessary
                                const pts = seg.fromId === from.id ? seg.points : [...seg.points].reverse();
                                const d = pts
                                    .map((p: { x: number; y: number }, idx: number) => `${idx === 0 ? "M" : "L"}${p.x},${p.y}`)
                                    .join(" ");
                                offsetPathStyle = {
                                    offsetPath: `path('${d}')`,
                                    offsetDistance: train.isAtStation ? "0%" : "100%",
                                    offsetRotate: "auto 90deg",
                                    transition: "offset-distance 0.9s linear",
                                };
                            }
                        }

                        // fallback coordinates if no path
                        const { x: fx, y: fy } = from.coordinates;

                        return (
                            <g
                                key={train.id}
                                onClick={() => {
                                    if (isAvailable) {
                                        gameManager.boardTrain(train);
                                    }
                                }}
                                style={{ cursor: isAvailable ? "pointer" : "default", ...offsetPathStyle }}
                            >
                                <circle
                                    cx={offsetPathStyle.offsetPath ? 0 : fx}
                                    cy={offsetPathStyle.offsetPath ? 0 : fy}
                                    r={SIZE}
                                    fill="#ffffff"
                                    opacity={train.isAtStation ? 1 : 0.9}
                                    className="transition-all duration-1000 ease-linear"
                                />
                                <image
                                    href="/SubwayTrain.svg"
                                    x={offsetPathStyle.offsetPath ? -SIZE / 2 : fx - SIZE / 2}
                                    y={offsetPathStyle.offsetPath ? -SIZE / 2 : fy - SIZE / 2}
                                    width={SIZE}
                                    height={SIZE}
                                    opacity={train.isAtStation ? 1 : 0.9}
                                    className="transition-all duration-1000 ease-linear"
                                />
                                <circle
                                    cx={offsetPathStyle.offsetPath ? 0 : fx}
                                    cy={offsetPathStyle.offsetPath ? 0 : fy}
                                    r={SIZE}
                                    fill="none"
                                    stroke="#000000"
                                    strokeWidth={1.5}
                                    className="transition-all duration-1000 ease-linear"
                                />
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}