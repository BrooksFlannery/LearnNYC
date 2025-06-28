import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

// context can be expanded later (user session, db access, etc.)
export type TrpcContext = {
    /** Authenticated user id, if any */
    userId?: string;
};

const t = initTRPC.context<TrpcContext>().create({
    transformer: superjson,
});

export const router = t.router; // builder to make routers

export const publicProcedure = t.procedure;

// ────────────────────────────────────────────
// Auth-aware helpers
// ────────────────────────────────────────────

const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, userId: ctx.userId! } });
});

export const protectedProcedure = t.procedure.use(isAuthed);