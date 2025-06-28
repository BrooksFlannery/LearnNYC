import { NextResponse } from 'next/server';
import { db } from '~/db/drizzle';
import { character } from '~/db/schema';
import { auth } from '~/lib/auth';

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers
        })

        if (!session) return NextResponse.json({ error: "Unathorized" }, { status: 401 })

        const characters = await db.select().from(character)

        return NextResponse.json(characters)
    } catch (error) {
        console.error('Error in /api/characters')
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
