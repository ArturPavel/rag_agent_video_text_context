import "./MainInputField.css"
import { useRef } from "react"

import TextareaAutosize from 'react-textarea-autosize';


export function MainInputField({ messagesArray, setMessagesArray, activeChat, setActiveChat, chatsArray, setChatsArray }) {
    const fileInput = useRef(null)
    const textareaElement = useRef(null)

    async function sendPrompt(event) {
        if (event.code === "Enter" && textareaElement.current.value.trim() == '') {
            event.preventDefault();
        } else if (!event.shiftKey && event.code === "Enter" && textareaElement.current.value.trim() != '' && (messagesArray.length == 0 || messagesArray[messagesArray.length - 1].sender != "Human")) {
            event.preventDefault();
            const inputPrompt = textareaElement.current.value
            
            if (!activeChat) {
                const newChatName = inputPrompt.slice(0, 30) 
                setChatsArray([newChatName, ...chatsArray])
                setActiveChat(newChatName)
                activeChat = newChatName
            }
            
            let newMessagesArray = [...messagesArray, {sender: "Human", text: inputPrompt}] 
            setMessagesArray([...newMessagesArray])
            
            textareaElement.current.value = ''
            
            let response = await fetch("/api/chatgpt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"user_prompt": newMessagesArray, "collection_name": activeChat})
            })

            response = await response.json()
            
            setMessagesArray([...newMessagesArray, {sender: response.sender, text: response.content}])
        }
    }

    async function sendFile(event) {
        let currentActiveChat = activeChat
        
        if (!activeChat) {
            let newChatName = event.target.files[0].name.slice(0, 30)
            setChatsArray([newChatName, ...chatsArray])
            setActiveChat(newChatName)
            currentActiveChat = newChatName
        }
        
        let fileType = event.target.files[0].type

        if (fileType !== 'image/jpeg' && fileType !== 'image/png' && fileType !== 'video/mp4' && fileType !== 'audio/mpeg' && fileType !== 'audio/wav' && fileType!== 'application/pdf') {
            alert("Invalid input format")
            return 0
        }

        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        formData.append("activeChat", currentActiveChat)

        let response = await fetch("/api/file-input", {
            method: "POST",
            body: formData
        })

        response = await response.json()
        console.log(response)
    }

    return(
        <div className="input-box">
            <div className="input-tag-container">
                <TextareaAutosize
                className="textarea-tag"
                minRows={1}
                maxRows={5}
                ref={textareaElement}
                onKeyDown={sendPrompt}
                placeholder="Ask anything"
                />
            </div>
            <div className="additional-tools">
                <label className="custom-file-upload">
                    Add context
                <input className="file-upload" type="file"
                onChange={() => {
                    sendFile(event)
                }}
                ref={fileInput}
                />
                </label>
            </div>
        </div>
    )
}