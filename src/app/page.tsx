'use client'

import { useEffect, useState } from "react";
import { CharacterScreen } from "~/components/character-screen";
import GameScreen from "~/components/GameScreen";
import { Logout } from "~/components/logout";
import SubwayMap from "~/components/SubwayMap";
import { useGame } from "~/hooks/useGame";
import { clientChatApi } from "~/lib/api";
import type { CharacterData, GameManager } from "~/lib/definitions/types";

export default function Home() {

  const gameManager: GameManager = useGame();

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
    <main className="h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">

      <header className="p-4 bg-white shadow-sm text-center flex justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Learn New York City</h1>
        <Logout />
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Game Controls */}
        <div className="w-1/3 p-6 overflow-y-auto border-r border-gray-200 flex flex-col justify-between">
          <GameScreen gameManager={gameManager} />
          <CharacterScreen characters={characters} onAdvanceTurn={gameManager.advanceTurn} characterTrigger={gameManager.characterTrigger} />
        </div>
        {/* Right panel - Map */}
        <div className="w-2/3 p-6 overflow-hidden">
          <SubwayMap gameManager={gameManager} />
        </div>
      </div>
    </main>
  )


}
