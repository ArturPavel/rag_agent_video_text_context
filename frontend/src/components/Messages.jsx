import './Messages.css'
import { Message } from './Message.jsx'
import { useEffect } from 'react'

export function Messages({ messagesArray, activeChat }) {
    useEffect(() => {
        localStorage.setItem(activeChat, JSON.stringify(messagesArray))
    }, [messagesArray])

    return (
        <>
            {
                messagesArray.map((message, index) => <Message
                sender={message.sender}
                text={message.text}
                key={index}
                />)
            }
        </>
    )
}