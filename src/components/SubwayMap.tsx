'use client';

import { Flag, MapPin } from "lucide-react";
import { REAL_STATIONS } from "~/domain/data/stations";
import type { GameManager } from "~/lib/definitions/types";
import { GOD_MODE } from "~/lib/godMode";
import { useGodMode } from "~/contexts/GodModeContext";
import { isTrainAtTerminus } from "~/lib/stationUtils";


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

                        return (
                            <g
                                key={train.id}
                                onClick={() => {
                                    if (isAvailable) {
                                        gameManager.boardTrain(train);
                                    }
                                }}
                                style={{ cursor: isAvailable ? "pointer" : "default" }}
                            >
                                {(() => {
                                    const SIZE = 10;
                                    const { x, y } = train.currentStation.coordinates;
                                    const cx = x;
                                    const cy = y;
                                    return (
                                        <>
                                            <circle
                                                cx={cx}
                                                cy={cy}
                                                r={SIZE}
                                                fill="#ffffff"
                                                opacity={train.isAtStation ? 1 : 0.9}
                                                className="transition-all duration-1000 ease-linear"
                                            />
                                            <image
                                                href="/SubwayTrain.svg"
                                                x={cx - SIZE / 2}
                                                y={cy - SIZE / 2}
                                                width={SIZE}
                                                height={SIZE}
                                                opacity={train.isAtStation ? 1 : 0.9}
                                                className="transition-all duration-1000 ease-linear"
                                            />
                                            <circle
                                                cx={cx}
                                                cy={cy}
                                                r={SIZE}
                                                fill="none"
                                                stroke="#000000"
                                                strokeWidth={1.5}
                                                className="transition-all duration-1000 ease-linear"
                                            />
                                        </>
                                    );
                                })()}
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}