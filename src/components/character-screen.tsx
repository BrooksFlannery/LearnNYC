'use client'

import type { CharacterData } from "~/lib/definitions/types";
import { ChatWindow } from "./chat-window";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function CharacterScreen({ characters }: { characters: CharacterData[] | null }) {
    const [character, setCharacter] = useState<CharacterData | null>(null);

    useEffect(() => {
        if (characters && characters.length > 0) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            const randomCharacter = characters?.[randomIndex];
            if (randomCharacter) {
                setCharacter(randomCharacter);
            }
        }
    }, [characters]);

    if (!character) {
        return (
            <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
            </div>
        );
    }

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex flex-col gap-6 w-100">
                <ChatWindow character={character} />
            </div>
        </div>
    )
}
