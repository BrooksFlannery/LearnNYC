'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clientChatApi } from "~/lib/api";
import type { CharacterData } from "~/lib/definitions/types";

export function CharacterMenu() {
    const api = new clientChatApi();

    const [characters, setCharacters] = useState<CharacterData[] | null>(null)
    const router = useRouter();


    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const chatData = await api.getCharacters();
                setCharacters(chatData);
            } catch (err) {
                console.error('Failed to fetch chats:', err);
            }
        };

        fetchCharacters();
    }, []);

    return (
        <>
            <h1>Characters</h1>
            {characters?.map(char => {
                return (
                    <div
                        onClick={() => router.push(`/${char.id}`)}
                        key={char.id}
                    >
                        {char.name}
                        {char.borough}
                    </div>
                )
            })}
        </>
    )
}