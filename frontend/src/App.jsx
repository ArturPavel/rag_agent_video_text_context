import './App.css'

import { useEffect, useState } from 'react'

import { MainInputField } from './components/MainInputField.jsx'
import { Message } from './components/Message.jsx'
import { Messages } from './components/Messages.jsx'
import { SidebarButton } from './components/SidebarButton.jsx'
import { History } from './components/History.jsx'

import { useAutoScroll } from './hooks/useAutoScroll.jsx'


function App() {
  const [ activeChat, setActiveChat ] = useState(() => {
    try {
      const temp = JSON.parse(localStorage.getItem("activeChat"))

      return (temp !== null) ? temp : ""
    } catch {
      return ""
    }
  })
  
  const [ messagesArray, setMessagesArray ] = useState(() => {
    try {
      const temp = JSON.parse(localStorage.getItem(activeChat))

      return (temp !== null) ? temp : [] 
    } catch {
      return []
    }    
  })

  useEffect(() => {
    localStorage.setItem("activeChat", JSON.stringify(activeChat))
    
    try {
      const temp = JSON.parse(localStorage.getItem(activeChat))

      
      temp !== null ? setMessagesArray(temp) : setMessagesArray([]) 
    } catch {
      setMessagesArray([])
    }
  }, [activeChat])

  const [ chatsArray, setChatsArray ] = useState(() => {
    try {
      const temp = JSON.parse(localStorage.getItem("chatsArray"))

      return (temp !== null) ? temp : [] 
    } catch {
      return []
    }
  })
  
  const [ sidebarWidth, setSidebarWidth ] = useState("280px")
  const [ historyDisplay, setHistoryDisplay ] = useState("block")

  const autoScroll = useAutoScroll(messagesArray)

  return (
    <div className='screen'>
      <div className='sidebar' style={{width: sidebarWidth}}>
        <SidebarButton 
          sidebarWidth={sidebarWidth} 
          setSidebarWidth={setSidebarWidth} 
          setHistoryDisplay={setHistoryDisplay}
        />

        <History 
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        historyDisplay={historyDisplay} 
        chatsArray={chatsArray}
        setChatsArray={setChatsArray}
        sidebarWidth={sidebarWidth} 
        setSidebarWidth={setSidebarWidth} 
        setHistoryDisplay={setHistoryDisplay}
        />
      </div>
      <div className='mainbar'>
        <div className='main-top'
        ref={autoScroll}
        >
        <Messages
        activeChat={activeChat}
        messagesArray={messagesArray}
        />
        </div>
        <div className='main-bottom'>
        <MainInputField
        messagesArray={messagesArray}
        setMessagesArray={setMessagesArray}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        chatsArray={chatsArray}
        setChatsArray={setChatsArray}
        />
        </div>
      </div>
    </div>
  )
}

export default App
