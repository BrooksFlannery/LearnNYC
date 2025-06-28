import {
    fetchRequestHandler,
    type FetchCreateContextFnOptions,
} from "@trpc/server/adapters/fetch";
import { appRouter } from "~/server/routers/appRouter";
import type { TrpcContext } from "~/server/trpc";
import { auth } from "~/lib/auth";

async function createContext(
    opts: FetchCreateContextFnOptions
): Promise<TrpcContext> {
    // Delegate to Better-Auth to read cookies & build the session
    const sessionData = await auth.api.getSession({ headers: opts.req.headers });

    return {
        userId: sessionData?.user?.id,
    };
}

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext,
    });

export { handler as GET, handler as POST }; 