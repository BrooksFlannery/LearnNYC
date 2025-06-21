'use client'
import { Card, CardContent } from "~/components/ui/card"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useChat } from '@ai-sdk/react'
import type { CharacterData } from '~/lib/definitions/types'
import { Button } from "./ui/button"
import Image from "next/image"

export function ChatWindow({ character, onAdvanceTurn }: { character: CharacterData; onAdvanceTurn?: () => void }) {

    const { messages, input, handleInputChange, handleSubmit, append } = useChat({
        api: `/api/characters/chat`,
        body: {
            characterId: character.id
        },
        initialMessages: [
            {
                id: 'system-1',
                role: 'system',
                content: character.prompt + "FACT: you are on the Subway with the user. RULES: you are not allowed to use emojis.",
            },
        ]
    })

    const lastAiMessage = messages
        .filter(message => message.role === 'assistant' && message.id !== 'system-1')
        .slice(-1)[0]

    useEffect(() => {
        const timer = setTimeout(() => {
            append({
                role: 'user',
                id: 'user-init',
                content: 'The user cant see this message, you need to introduce yourself where you are from.'
            })
        }, 5)
        return () => clearTimeout(timer)
    }, [append])

    const submit = () => {
        handleSubmit();
        if (onAdvanceTurn) {
            onAdvanceTurn();
        }
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit();
    };


    if (!character) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex justify-center relative w-[400]">
            <Image
                src={character.image}
                alt='reebe_ruben image'
                width={300}
                height={0}
                className="absolute rounded-t-md m-6"
            />
            <Card className="gap-0 h-140 justify-end">
                <CardContent className="flex flex-col z-10 min-h-auto justify-end ">

                    <div className="text-sm backdrop-brightness-40 text-primary-foreground rounded-md p-4 overflow-y-auto flex justify-center items-start">
                        {lastAiMessage ? (
                            lastAiMessage.content
                        ) : (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading...
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
    )
}