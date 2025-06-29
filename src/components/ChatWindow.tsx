'use client'
import { Card, CardContent } from "~/components/ui/card";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import type { CharacterData } from "~/lib/definitions/types";
import { Button } from "./ui/button";
import Image from "next/image";

export function ChatWindow({ character, onAdvanceTurn }: { character: CharacterData; onAdvanceTurn?: () => void }) {
    const starterBehaviors = [
        "STARTING BEHAVIOR: Ask a rhetorical question about the city or life.",
        "STARTING BEHAVIOR: Make a bold opinionated statement and wait for disagreement.",
        "STARTING BEHAVIOR: Reflect on something you overheard earlier today.",
        "STARTING BEHAVIOR: Complain lightly about something mundane.",
        "STARTING BEHAVIOR: Mention a strange dream you had recently.",
        "STARTING BEHAVIOR: Pose a philosophical question with no obvious answer.",
        "STARTING BEHAVIOR: Bring up a memory that's on your mind.",
        "STARTING BEHAVIOR: Accuse the user (jokingly or not) of looking suspiciously familiar.",
        "STARTING BEHAVIOR: Say something cryptic and let them figure it out.",
        "STARTING BEHAVIOR: Admit something odd about your mood today.",
        "STARTING BEHAVIOR: Say what you would do if you ran this city.",
        "STARTING BEHAVIOR: State something confidently that might not be true.",
        "STARTING BEHAVIOR: Ask what time it is, then ignore the answer.",
        "STARTING BEHAVIOR: Talk about a rule you always follow, even if no one else does.",
        "STARTING BEHAVIOR: Confess something small, like a guilty pleasure.",
        "STARTING BEHAVIOR: Pretend the user just interrupted your train of thought.",
    ];

    const randomStarter = useRef(starterBehaviors[Math.floor(Math.random() * starterBehaviors.length)]).current;

    const { messages, input, handleInputChange, handleSubmit, append } = useChat({
        api: `/api/characters/chat`,
        body: {
            characterId: character.id,
        },
        credentials: "include",
        initialMessages: [
            {
                id: "system-1",
                role: "system",
                content: `
                ${character.prompt}


                SCENE:
                You are on the NYC Subway with the user.

                ${randomStarter}

                RULES:
                - Always stay in character.
                - Don't get tripped up on user typos
                - Do not use emojis.
                - Respond naturally and conversationally.
                - Ask the user questions occasionally to keep the dialogue going.
      `.trim(),
            },
        ],
    });

    const lastAiMessage = messages
        .filter((message) => message.role === "assistant" && message.id !== "system-1")
        .slice(-1)[0];

    useEffect(() => {
        const timer = setTimeout(() => {
            void append({
                role: "user",
                id: "user-init",
                content:
                    "The user cant see this message, you need to talk to them in a way that would make sense if you were approaching a stranger.",
            });
        }, 5);
        return () => clearTimeout(timer);
    }, [append]);

    const submit = () => {
        void handleSubmit();
        if (onAdvanceTurn) {
            onAdvanceTurn();
        }
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit();
    };

    if (!character) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex justify-center relative w-[400]">
            <Image src={character.image} alt="reebe_ruben image" width={300} height={0} className="absolute rounded-t-md m-6" />
            <Card className="gap-0 h-140 justify-end">
                <CardContent className="flex flex-col z-10 min-h-auto justify-end ">
                    <div className="text-sm backdrop-brightness-40 text-primary-foreground rounded-md p-4 overflow-y-auto flex justify-center items-start">
                        {lastAiMessage ? (
                            lastAiMessage.content
                        ) : (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                            </div>
                        )}
                    </div>

                    <form className="flex flex-col" onSubmit={handleFormSubmit}>
                        <label htmlFor="answer" />
                        <textarea
                            rows={4}
                            cols={40}
                            className="bg-accent border-4 rounded-b-md p-2 resize-none w-full my-2"
                            name="answer"
                            id="answer"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    submit();
                                }
                            }}
                            placeholder="Type your answer..."
                        />
                        <Button type="submit" className="w-full" variant="outline">
                            Submit
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 