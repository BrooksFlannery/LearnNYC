'use client'

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { use } from 'react';
import ChatDisplay from '~/components/chat-display';
import { clientChatApi } from '~/lib/api';
import type { CharacterData } from '~/lib/definitions/types';

export default function Page({ params }: { params: Promise<{ characterId: string }> }) {
    const [character, setCharacter] = useState<CharacterData | null>(null);
    const api = new clientChatApi();
    const { characterId } = useParams();

    useEffect(() => {
        api.getCharacter(characterId as string).then(setCharacter);
    }, [characterId]);

    if (!character?.prompt) return <div>Loading character…</div>;

    return <ChatDisplay {...character} />;
}