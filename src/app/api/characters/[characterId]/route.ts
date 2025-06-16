import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { db } from '~/db/drizzle';
import { character } from '~/db/schema';
import { auth } from '~/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ characterId: string }> }
) {
    const { characterId } = await params;

    try {
        const session = await auth.api.getSession({
            headers: req.headers
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!characterId || typeof characterId !== 'string') {
            return NextResponse.json({ error: "Invalid character ID" }, { status: 400 });
        }

        const [characterData] = await db
            .select()
            .from(character)
            .where(eq(character.id, characterId));

        if (!characterData) {
            return NextResponse.json({ error: "Character not found" }, { status: 404 });
        }

        return NextResponse.json(characterData);
    } catch (error) {
        console.error('Error in /api/characters:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}