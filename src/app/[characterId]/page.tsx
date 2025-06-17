'use client'

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clientChatApi } from '~/lib/api';
import type { CharacterData } from '~/lib/definitions/types';
import { Loader2 } from "lucide-react"
import { ChatWindow } from '~/components/chat-window';

export default function Page({ params }: { params: Promise<{ characterId: string }> }) {
    const [character, setCharacter] = useState<CharacterData | null>(null);
    const api = new clientChatApi();
    const { characterId } = useParams();

    useEffect(() => {
        api.getCharacter(characterId as string).then(setCharacter);
    }, [characterId]);

    if (!character?.prompt) return (
        <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
        </div>
    );

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex flex-col gap-6 w-100">
                <ChatWindow character={character} />
            </div>
        </div>
    );
}