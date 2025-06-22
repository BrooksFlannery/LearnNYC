import { z } from "zod";
import { router, publicProcedure } from "~/server/trpc";
import { gameStore } from "~/server/stores/game";


export const gameRouter = router({
    getState: publicProcedure.query(({ ctx }) => {
        return gameStore.getState(ctx.userId);
    }),
    makeMove: publicProcedure
        .input(z.object({ nextStationId: z.string() }))
        .mutation(({ ctx, input }) => {
            return gameStore.makeMove(ctx.userId, input.nextStationId);
        }),
    boardTrain: publicProcedure
        .input(z.object({ trainId: z.string() }))
        .mutation(({ ctx, input }) => {
            return gameStore.boardTrain(ctx.userId, input.trainId);
        }),
    exitTrain: publicProcedure.mutation(({ ctx }) => {
        return gameStore.exitTrain(ctx.userId);
    }),
    advanceTurn: publicProcedure.mutation(({ ctx }) => {
        return gameStore.advanceTurn(ctx.userId);
    }),
});


//procedures are one callable endpoint
//routers are groupings of procedures(or other routers?)