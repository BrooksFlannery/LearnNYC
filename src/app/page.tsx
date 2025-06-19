'use client'

import { useEffect, useState } from "react";
import { CharacterScreen } from "~/components/character-screen";
import { clientChatApi } from "~/lib/api";
import type { CharacterData } from "~/lib/definitions/types";

export default function Home() {
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

  return <CharacterScreen characters={characters} />;
}
