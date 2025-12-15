import { useRef, useEffect } from "react";

export function useAutoScroll(dependencies) {
    const chatMessagesRef = useRef(null);
    
    useEffect(() => {
      const containerElem = chatMessagesRef.current
      if (containerElem) {
        containerElem.scrollTop = containerElem.scrollHeight
      }
    }, [dependencies]);

    return chatMessagesRef
}