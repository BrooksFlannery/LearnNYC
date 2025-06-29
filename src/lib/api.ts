import type { CharacterData } from "~/lib/definitions/types";
import { z } from "zod";
import { characterSchema } from "./definitions/zod";

export interface ChatNYCApi {
    getCharacters(): Promise<CharacterData[]>;
}

const characterArraySchema = z.array(characterSchema);

export class clientChatApi implements ChatNYCApi {
    async getCharacters(): Promise<CharacterData[]> {
        try {
            const res = await fetch("/api/characters", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error(`Failed to fetch characters: ${res.status}`)

            const data: unknown = await res.json();
            const validatedData = characterArraySchema.parse(data);
            return validatedData;
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Character data validation failed:', error.errors);
                throw new Error('Invalid chat data format received from server');
            }
            console.error('Error fetching chats:', error);
            throw error;
        }
    }
}
