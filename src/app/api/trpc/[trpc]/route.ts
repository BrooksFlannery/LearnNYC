import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "~/server/routers/appRouter";
import type { TrpcContext } from "~/server/trpc";

function createContext(): TrpcContext {
    // TODO: Add auth session extraction here
    return {};
}

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext,
    });

export { handler as GET, handler as POST }; 