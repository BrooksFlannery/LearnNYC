import { useChat } from '@ai-sdk/react'
import { useEffect, useState } from 'react';
import type { CharacterData } from '~/lib/definitions/types';

export default function ChatDisplay(character: CharacterData) {
    const [load, setLoad] = useState<Boolean>(false);

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
                content: "The user cant see this message, you neet to use the giveQuiz tool"
            }
        ]
    });

    if (!character) {
        return <div>Loading...</div>; // this shouldn't be possible? maybe redirect to home
    }

    useEffect(() => {
        setLoad(true)
        const timer = setTimeout(() => {
            append({ role: 'user', id: 'user-1', content: 'The user cant see this message, you neet to introduce yourself then use the giveQuiz tool' });
        }, 5);
        return () => clearTimeout(timer);
    }, [append]); // Add append to dependencies

    return (
        <>
            {messages
                .filter(message => message.id !== 'system-1' && message.id !== 'user-1')
                .map(message => (
                    <div key={message.id}>
                        {message.role === 'user' ? 'User: ' : 'AI: '}
                        {message.content}
                    </div>
                ))}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                />
                <button disabled={!load} type="submit">Submit</button>
            </form>
        </>
    );
}