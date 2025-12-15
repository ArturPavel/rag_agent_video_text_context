const smallSidebar = "56px"
const largeSidebar = "280px"
const defaultDisplay = "block"
const noneDisplay = "none"

export function chageSidebar(sidebarWidth, setSidebarWidth, setHistoryDisplay, isAddChatButton = false) {
    if (sidebarWidth === smallSidebar) {
        setSidebarWidth(largeSidebar)
        setHistoryDisplay(defaultDisplay)
    } else if (!isAddChatButton) { 
        setSidebarWidth(smallSidebar)
        setHistoryDisplay(noneDisplay)
    }
}