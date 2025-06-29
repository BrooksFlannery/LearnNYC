import { trpc } from "~/lib/trpc";
import type { GameManager, Station, Train } from "~/lib/definitions/types";

export function useGameState(): GameManager {
    const utils = trpc.useUtils();
    const { data: game } = trpc.game.getState.useQuery(undefined, {
        suspense: false,
    });

    const gameState = game ?? null;

    const makeMoveMut = trpc.game.makeMove.useMutation({
        onSuccess(data) {
            utils.game.getState.setData(undefined, data);
        },
    });

    const boardTrainMut = trpc.game.boardTrain.useMutation({
        onSuccess(data) {
            utils.game.getState.setData(undefined, data);
        },
    });


    const exitTrainMut = trpc.game.exitTrain.useMutation({
        onSuccess(data) {
            utils.game.getState.setData(undefined, data);
        },
    });

    const advanceTurnMut = trpc.game.advanceTurn.useMutation({
        onSuccess(data) {
            utils.game.getState.setData(undefined, data);
        },
    });

    const resetGameMut = trpc.game.resetGame.useMutation({
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

    const exitTrain = (train: Train) => {
        void train;
        exitTrainMut.mutate();
    };

    const advanceTurn = () => {
        advanceTurnMut.mutate();
    };

    const resetGame = () => {
        resetGameMut.mutate();
    };

    return {
        game: gameState,
        makeMove,
        exitTrain,
        boardTrain,
        advanceTurn,
        resetGame,
    };
} 