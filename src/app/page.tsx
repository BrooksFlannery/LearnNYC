'use client'

import { useEffect, useState } from "react";
import { CharacterScreen } from "~/components/character-screen";
import GameScreen from "~/components/GameScreen";
import { Logout } from "~/components/logout";
import SubwayMap from "~/components/SubwayMap";
import { useGameState } from "~/hooks/useGameState";
import { clientChatApi } from "~/lib/api";
import type { CharacterData, GameManager } from "~/lib/definitions/types";
import { GodModeProvider } from "~/contexts/GodModeContext";

export default function Home() {

  const gameManager: GameManager = useGameState();

  const [characters, setCharacters] = useState<CharacterData[] | null>(null);
  const api = new clientChatApi();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const chatData: CharacterData[] = await api.getCharacters();
        setCharacters(chatData);
      } catch (err) {
        console.error('Failed to fetch chats:', err);
      }
    };

    fetchCharacters();
  }, []);

  return (
    <GodModeProvider>
      <main className="h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">

        <header className="p-2 bg-white flex justify-between border-2">
          <h1 className="text-3xl font-bold text-gray-900">Learn New York City</h1>
          <Logout />
        </header>
        <div className="relative flex-1 overflow-hidden">
          <SubwayMap gameManager={gameManager} />
          { }
          {/* Upcoming arrivals – bottom right */}
          <div className="absolute bottom-0 right-0 p-4 pointer-events-none max-w-sm w-80">
            <div className="pointer-events-auto">
              <GameScreen gameManager={gameManager} />
            </div>
          </div>

          {/* Character screen – bottom left */}
          <div className="absolute bottom-0 left-0 p-4 pointer-events-none max-w-sm w-80">
            <div className="pointer-events-auto">
              <CharacterScreen
                characters={characters}
                onAdvanceTurn={gameManager.advanceTurn}
                characterTrigger={gameManager.characterTrigger}
              />
            </div>
          </div>
        </div>
      </main>
    </GodModeProvider>
  )
}
