import './Chat.css'
import x from '../assets/x.png' 

export function Chat({ activeChat, setActiveChat, content, chatsArray, setChatsArray}) {

    
    async function deleteData(content) {
        let newChatsArray = [...chatsArray]
        newChatsArray.splice(chatsArray.indexOf(content), 1) 
        setChatsArray(newChatsArray)

        localStorage.removeItem(content)

        let response = await fetch("/api/chromadb", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"chroma_collection": content})
        })

        response = await response.json()

        console.log(response)

        setActiveChat("")
    }
    
    return (
        <div className={`chat-name ${(activeChat === content) ? "active-chat" : "" }`}>
            <div className='chat-text'
            onClick={() => {
                activeChat !== content && setActiveChat(content)
            }}>
            {content}
            </div>

            <div className='second-chat-part'>
                <button 
                className='delete-button'
                onClick={() => {
                    deleteData(content)
                }}
                >
                    <img className="delete-image" src={x}/>
                </button>
            </div>
        </div>
    )
}