import "./History.css"
import { Chat } from "./Chat.jsx"
import newChatIcon from "../assets/NewChatLighter.png"
import { useEffect, useState, useRef } from "react"
import { chageSidebar } from "../utils/sidebar.jsx"

export function History({ activeChat, setActiveChat, historyDisplay, chatsArray, setChatsArray, sidebarWidth, setSidebarWidth, setHistoryDisplay}) {
    const [ chatTitle, addChatTitle ] = useState("none")
    const chatTitleElement = useRef(null)

    useEffect(() => {
        localStorage.setItem("chatsArray", JSON.stringify(chatsArray))
    }, [chatsArray])

    useEffect(() => {
        chatTitleElement.current.focus()
    }, [chatTitle])

    function sendChatTitle(event) {
        if (event.key === "Enter" && chatTitleElement.current.value.trim() !== '') {
            if (chatsArray.includes(chatTitleElement.current.value)) {
                alert("Please use a different name - this name is already used")
            } else {
                setChatsArray([chatTitleElement.current.value, ...chatsArray])
                addChatTitle("none")
                chatTitleElement.current.value = ''
            }
        }
    }

    return (
        <>
            <div>
            <button className="add-new-chat"
            onClick={() => {
                chageSidebar(sidebarWidth, setSidebarWidth, setHistoryDisplay, true)

                if (chatTitle === "none") {
                    addChatTitle("block")
                } else {
                    addChatTitle("none")
                    chatTitleElement.current.value = ''
                }

                }
            }
            >
                <img src={newChatIcon} className="add-new-chat-image"/>
                <div className="add-new-chat-text" style={{display: historyDisplay}}>New chat</div>
            </button>
            </div>

            <div className="chat-history-header" style={{display: historyDisplay}}
            >Your history: </div>

            <div className="chat-history" style={{display: historyDisplay}}>
                <div className="chat-name-input"
                
                style={{"display": chatTitle}}>
                    <input 
                    className="chat-name-input-element"
                    type="text" 
                    maxLength="30" 
                    placeholder="Enter title"
                    ref={chatTitleElement}
                    onKeyDown={sendChatTitle}/>
                </div>

                {chatsArray.map((content, iterator) => {
                    return (
                        <Chat
                        activeChat={activeChat}
                        setActiveChat={setActiveChat}
                        content={content}
                        chatsArray={chatsArray}
                        setChatsArray={setChatsArray}
                        key={iterator}
                        />
                    )
                })}
            </div>
        </>
    )
}