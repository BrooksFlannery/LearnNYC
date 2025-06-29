'use client';

import type { GameManager } from '~/lib/definitions/types';

import GodModeOverlay from './gamePanels/GodModeOverlay';
import WalkablePanel from './gamePanels/WalkablePanel';
import ArrivalsPanel from './gamePanels/ArrivalsPanel';
import TrainPanel from './gamePanels/TrainPanel';
import { GOD_MODE } from "~/lib/godMode";

export default function GameScreen({ gameManager }: { gameManager: GameManager }) {
    return (
        <>
            {/* God-mode overlay */}
            <GodModeOverlay gameManager={gameManager} />

            {/* Main in-game panels */}
            {gameManager.game ? (
                <div className="space-y-6">
                    <WalkablePanel gameManager={gameManager} />
                    {!GOD_MODE && <ArrivalsPanel gameManager={gameManager} />}
                    <TrainPanel gameManager={gameManager} />
                </div>
            ) : (
                <div>Loading Spinner...</div>
            )}
        </>
    );
} 