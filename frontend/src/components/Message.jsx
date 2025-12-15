import "./Message.css"
import AIlogo from "../assets/TRUE_LOGO.png"
import Humanlogo from "../assets/Human_logo.png"

export function Message({ sender, text }) {

    return(
        <div className={`message ${sender === "AI" ? "AI-message" : "human-message"}`}>
            {sender === "AI" && <img 
            src={AIlogo}
            className="logo AI-logo"
            />}

            <div
            className={`message-text ${sender === "AI" ? "message-text-AI" : "message-text-human"}`}
            >{text}</div>

            {sender === "Human" && <img 
            src={Humanlogo}
            className="logo Human-logo"
            />}
        </div>
    )
}