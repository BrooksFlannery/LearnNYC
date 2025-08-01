import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";
import { gameService } from "~/server/services/gameService";


export const gameRouter = router({
    getState: protectedProcedure.query(async ({ ctx }) => {
        return await gameService.getState(ctx.userId);
    }),
    makeMove: protectedProcedure
        .input(z.object({ nextStationId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return await gameService.makeMove(ctx.userId, input.nextStationId);
        }),
    boardTrain: protectedProcedure
        .input(z.object({ trainId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return await gameService.boardTrain(ctx.userId, input.trainId);
        }),
    exitTrain: protectedProcedure.mutation(async ({ ctx }) => {
        return await gameService.exitTrain(ctx.userId);
    }),
    advanceTurn: protectedProcedure.mutation(async ({ ctx }) => {
        return await gameService.advanceTurn(ctx.userId);
    }),
    resetGame: protectedProcedure.mutation(async ({ ctx }) => {
        return await gameService.resetGame(ctx.userId);
    }),
});


//procedures are one callable endpoint
//routers are groupings of procedures(or other routers?)