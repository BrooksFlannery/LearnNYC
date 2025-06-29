'use client'

import type { CharacterData } from "~/lib/definitions/types";
import { ChatWindow } from "./chat-window";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { GOD_MODE } from "~/lib/godMode";

export function CharacterScreen({ characters, onAdvanceTurn, characterTrigger }: { characters: CharacterData[] | null; onAdvanceTurn?: () => void; characterTrigger: number }) {
    const [character, setCharacter] = useState<CharacterData | null>(null);

    useEffect(() => {
        if (characters && characters.length > 0) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            const randomCharacter = characters?.[randomIndex];
            if (randomCharacter) {
                setCharacter(randomCharacter);
            }
        }
    }, [characters, characterTrigger]);

    if (GOD_MODE) return null;

    if (!character) {
        return (
            <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
            </div>
        );
    }

    return (
        <div className="flex flex-col w-100">
            <ChatWindow
                key={`${character.id}-${characterTrigger}`}
                character={character}
                {...(onAdvanceTurn ? { onAdvanceTurn } : {})}
            />
        </div>
    )
}
