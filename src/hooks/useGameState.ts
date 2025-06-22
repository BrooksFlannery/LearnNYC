import { useState } from "react";
import { trpc } from "~/utils/trpc";
import type { GameManager, Station, Train } from "~/lib/definitions/types";

function increment(prev: number) {
    return prev + 1;
}

export function useGameState(): GameManager {
    const utils = trpc.useUtils();
    const { data: game } = trpc.game.getState.useQuery(undefined, {
        suspense: false,
    });

    const gameState = game ?? null;

    const [characterTrigger, setCharacterTrigger] = useState(0);//i really dont like that this hacky thing is still around but i cant be bothered rnnnnnn

    const makeMoveMut = trpc.game.makeMove.useMutation({
        onSuccess(data) {
            utils.game.getState.setData(undefined, data);
            setCharacterTrigger(increment);
        },
    });

    const boardTrainMut = trpc.game.boardTrain.useMutation({
        onSuccess(data) {
            utils.game.getState.setData(undefined, data);
            setCharacterTrigger(increment);
        },
    });


    const exitTrainMut = trpc.game.exitTrain.useMutation({
        onSuccess(data) {
            utils.game.getState.setData(undefined, data);
            setCharacterTrigger(increment);
        },
    });

    const advanceTurnMut = trpc.game.advanceTurn.useMutation({
        onSuccess(data) {
            utils.game.getState.setData(undefined, data);
        },
    });

    //components call these
    const makeMove = (next: Station) => {
        makeMoveMut.mutate({ nextStationId: next.id });
    };

    const boardTrain = (train: Train) => {
        boardTrainMut.mutate({ trainId: train.id });
    };

    const exitTrain = (_: Train) => {
        exitTrainMut.mutate();
    };

    const advanceTurn = () => {
        advanceTurnMut.mutate();
    };

    return {
        game: gameState,
        makeMove,
        exitTrain,
        boardTrain,
        advanceTurn,
        characterTrigger,
    };
} 