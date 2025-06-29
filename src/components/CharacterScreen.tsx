'use client'

import type { CharacterData } from "~/lib/definitions/types";
import { useMemo, useState, useEffect } from "react";
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
    // When in GOD_MODE, allow manual character selection via dropdown
    const [selectedCharId, setSelectedCharId] = useState<string | null>(null);

    // Keep selectedCharId in sync with currentCharacterId when not manually overridden
    useEffect(() => {
        if (!GOD_MODE) return;
        if (currentCharacterId && !selectedCharId) {
            setSelectedCharId(currentCharacterId);
        }
    }, [currentCharacterId, selectedCharId]);

    const effectiveCharacterId = GOD_MODE ? selectedCharId ?? currentCharacterId : currentCharacterId;

    const character = useMemo(() => {
        if (!characters || !effectiveCharacterId) return null;
        return characters.find((c) => c.id === effectiveCharacterId) ?? null;
    }, [characters, effectiveCharacterId]);

    if (!character) {
        return (
            <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading...
            </div>
        );
    }

    return (
        <div className="flex flex-col w-100 space-y-2">
            {GOD_MODE && characters ? (
                <select
                    value={selectedCharId ?? ""}
                    onChange={(e) => setSelectedCharId(e.target.value || null)}
                    className="border rounded p-1 text-sm"
                >
                    <option value="">— Select Character —</option>
                    {characters.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            ) : null}

            <ChatWindow
                key={character.id}
                character={character}
                {...(onAdvanceTurn ? { onAdvanceTurn } : {})}
            />
        </div>
    );
} 