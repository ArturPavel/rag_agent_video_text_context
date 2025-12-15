import "./SidebarButton.css"
import logo from "../assets/TRUE_LOGO.png"
import { chageSidebar } from "../utils/sidebar"


export function SidebarButton({ sidebarWidth, setSidebarWidth, setHistoryDisplay }) {
    return(
        <button className="sidebar-button" onClick={() => {chageSidebar(sidebarWidth, setSidebarWidth, setHistoryDisplay)}}>
            <img src={logo} className="sidebar-button-image"/>
        </button>
    )
}