'use client';

import { Flag } from "lucide-react";
import { REAL_STATIONS } from "~/lib/data/realStations";
import type { GameManager } from "~/lib/definitions/types";


export default function SubwayMap({ gameManager }: { gameManager: GameManager }) {

    const ZOOM_WIDTH = 700;//we should allow the users scroll wheel to affect this
    const ZOOM_HEIGHT = 700;

    const current = gameManager.game?.currentStation.coordinates;//we should be tweening the transition
    const zoomViewBox = current// i need some logic that makes sure we keep all transfer stations on screen...
        ? `${current.x - ZOOM_WIDTH / 2} ${current.y - ZOOM_HEIGHT / 2} ${ZOOM_WIDTH} ${ZOOM_HEIGHT}`
        : "0 0 2500 2700";

    if (!gameManager.game) {
        return (
            <div>Loadding spinner goes here...</div>
        )
    }

    return (
        <div className="w-full h-full relative">
            {/* Map interaction overlay at bottom */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between px-6 pb-6 pointer-events-none z-10">
                {/* Goal */}
                <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-lg border-2 backdrop-blur-md pointer-events-auto">
                    <Flag className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-gray-700">
                        Destination: {gameManager.game.destinationStation.name}
                    </span>
                </div>

                {/* Current Location */}
                <div className="bg-white p-4 rounded-lg shadow-lg border-2 pointer-events-auto">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Current Location</h2>
                    <p className="text-gray-700">{gameManager.game.currentStation.name}</p>
                </div>
            </div>

            <svg viewBox={zoomViewBox} className="w-full h-full">
                {/* Subway map base image */}
                <image href="/nyc_subway_map.svg" x={0} y={0} width={2500} height={2700} />

                {/* Draw stations */}
                {REAL_STATIONS.map(station => {
                    const isCurrent = station.id === gameManager.game?.currentStation.id;
                    const isAvailable =
                        !gameManager.game?.currentTrain &&
                        gameManager.game?.currentStation.walkable?.includes(station.id);

                    return (
                        <g
                            key={station.id}
                            onClick={() => {
                                if (isAvailable) {
                                    gameManager.makeMove(station);
                                }
                            }}
                            style={{ cursor: isAvailable ? "pointer" : "default" }}
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
                        </g>
                    );
                })}

                {/* Draw trains */}
                {gameManager.game.trains.map(train => {
                    const isAvailable = train.currentStation.id === gameManager.game?.currentStation.id;

                    return (
                        <g
                            key={train.id}
                            onClick={() => {
                                if (isAvailable) {
                                    console.log("boarding", train.id);
                                    gameManager.boardTrain(train);
                                }
                            }}
                            style={{ cursor: isAvailable ? "pointer" : "default" }}
                        >
                            <circle
                                cx={train.currentStation.coordinates.x}
                                cy={train.currentStation.coordinates.y}
                                r={7}
                                fill={train.isAtStation ? "#FF0000" : "#FF69B4"}
                                className="transition-all duration-1000"
                            />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}