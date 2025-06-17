'use client'
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useChat } from '@ai-sdk/react'
import type { CharacterData } from '~/lib/definitions/types'
import { Button } from "./ui/button"

export function ChatWindow({ character }: { character: CharacterData }) {

    const { messages, input, handleInputChange, handleSubmit, append } = useChat({
        api: `/api/characters/chat`,
        body: {
            characterId: character.id
        },
        initialMessages: [
            {
                id: 'system-1',
                role: 'system',
                content: character.prompt,
            },
            {
                id: 'user-1',
                role: 'user',
                content: "The user cant see this message, you need to use the giveQuiz tool"
            }
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
                content: 'The user cant see this message, you need to introduce yourself then use the giveQuiz tool'
            })
        }, 5)
        return () => clearTimeout(timer)
    }, [append])

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        handleSubmit(e)
    }

    if (!character) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <Card className="gap-0">
                <CardContent className="flex flex-col gap-4">
                    <div className="bg-primary text-primary-foreground flex items-center justify-center rounded-md w-full h-40">
                        img goes here
                    </div>

                    <div className="bg-primary text-primary-foreground rounded-md p-4 h-60 overflow-y-auto flex justify-center items-start">
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
                            className="border-4 rounded-md p-2 resize-none w-full my-2"
                            name="answer"
                            id="answer"
                            value={input}
                            onChange={handleInputChange}
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