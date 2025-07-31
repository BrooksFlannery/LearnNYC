import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "~/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { schema } from "~/db/schema";
import { env } from "~/env";

export const auth = betterAuth({
    baseURL: env.NODE_ENV === "production" 
        ? "https://nyc-chatbot-alpha.vercel.app" 
        : "http://localhost:3000",
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
        // github: {
        //     clientId: process.env.GITHUB_CLIENT_ID as string,
        //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        // },
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    plugins: [nextCookies()] // make sure this is the last plugin in the array

});