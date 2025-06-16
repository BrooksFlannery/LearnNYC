import { NextResponse } from 'next/server';
import { db } from '~/db/drizzle';
import { character } from '~/db/schema';
import { auth } from '~/lib/auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers
        })
        console.log('headers', req.headers)

        if (!session) return NextResponse.json({ error: "Unathorized" }, { status: 401 })

        console.log(session);

        const characters = await db.select().from(character)

        // const { id } = await params;
        // const characterId = id;

        // if (!characterId || typeof characterId !== 'string') {
        //     return NextResponse.json({ error: "Invalid character ID" }, { status: 400 });
        // }

        // const [characterData] = await db
        //     .select()
        //     .from(character)
        //     .where(eq(character.id, characterId));

        // if (!characterData) return NextResponse.json({ error: "Character not found" }, { status: 404 });

        return NextResponse.json(characters)
    } catch (error) {
        console.error('Error in /api/[characterId]')
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
