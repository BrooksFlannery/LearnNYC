import { useChat } from '@ai-sdk/react'
import type { CharacterData } from '~/lib/definitions/types';

export default function ChatDisplay(character: CharacterData) {

    const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
        api: `/api/characters/chat`,
        initialMessages: [
            {
                id: 'system-1',
                role: 'system',
                content: character.prompt
            }
        ]
    });

    if (!character) {
        return <div>Loading...</div>;//this shouldnt be possible? maybe redirect to home
    }

    return (
        <>
            {messages
                .filter(message => message.id !== 'system-1')
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
                <button type="submit">Submit</button>
            </form>
        </>
    );
}