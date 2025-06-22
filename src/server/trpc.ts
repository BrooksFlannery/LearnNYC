import { initTRPC } from "@trpc/server";
import superjson from "superjson";

// context can be expanded later (user session, db access, etc.)
export type TrpcContext = {
    userId?: string;
};

const t = initTRPC.context<TrpcContext>().create({
    transformer: superjson,
});

export const router = t.router;//builder to make reouters, this will be more useful when i reimplement auth like >>> authRouter = t.router.use(auth) where auth is some t.middleware or t.router.use(logging)  for all routesetc...
export const publicProcedure = t.procedure; //builder to make procedures