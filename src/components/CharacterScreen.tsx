'use client'

import type { CharacterData } from "~/lib/definitions/types";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { ChatWindow } from "./ChatWindow";
import { GOD_MODE } from "~/lib/godMode";

export function CharacterScreen({
    characters,
    onAdvanceTurn,
    currentCharacterId,
}: {
    characters: CharacterData[] | null;
    onAdvanceTurn?: () => void;
    currentCharacterId: string | null | undefined;
}) {
    const character = useMemo(() => {
        if (!characters || !currentCharacterId) return null;
        return characters.find((c) => c.id === currentCharacterId) ?? null;
    }, [characters, currentCharacterId]);

    if (GOD_MODE) return null;

    if (!character) {
        return (
            <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading...
            </div>
        );
    }

    return (
        <div className="flex flex-col w-100">
            <ChatWindow
                key={character.id}
                character={character}
                {...(onAdvanceTurn ? { onAdvanceTurn } : {})}
            />
        </div>
    );
} 