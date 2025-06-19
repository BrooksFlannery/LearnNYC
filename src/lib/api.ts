import type { CharacterData } from "~/lib/definitions/types";
import { characterSchema } from "~/lib/definitions/zod";
import { z } from "zod";

export interface chatNycApi {
    getCharacters(): Promise<CharacterData[]>;
    getCharacter(characterId: CharacterData["id"]): Promise<CharacterData>;
}

// const createChatResponseSchema = z.object({
//     id: z.string().uuid(),
// });

const characterArraySchema = z.array(characterSchema);
// const messagesArraySchema = z.array(messageSchema);

export class clientChatApi implements chatNycApi {
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

    async getCharacter(characterId: CharacterData['id']): Promise<CharacterData> {
        try {
            const res = await fetch(`/api/characters/${characterId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error(`Failed to fetch character: ${res.status}`)

            const data: unknown = await res.json();
            const validatedData = characterSchema.parse(data);
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
