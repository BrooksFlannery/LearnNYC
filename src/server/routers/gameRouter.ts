import { z } from "zod";
import { router, publicProcedure } from "~/server/trpc";
import { gameService } from "~/server/services/gameService";


export const gameRouter = router({
    getState: publicProcedure.query(async ({ ctx }) => {
        return await gameService.getState(ctx.userId);
    }),
    makeMove: publicProcedure
        .input(z.object({ nextStationId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return await gameService.makeMove(ctx.userId, input.nextStationId);
        }),
    boardTrain: publicProcedure
        .input(z.object({ trainId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return await gameService.boardTrain(ctx.userId, input.trainId);
        }),
    exitTrain: publicProcedure.mutation(async ({ ctx }) => {
        return await gameService.exitTrain(ctx.userId);
    }),
    advanceTurn: publicProcedure.mutation(async ({ ctx }) => {
        return await gameService.advanceTurn(ctx.userId);
    }),
});


//procedures are one callable endpoint
//routers are groupings of procedures(or other routers?)