import { useState } from "react";
import ChatContext from "./ChatContext";

export default function ChatProvider({children}){
    const [ sidebarVisible, setSidebarVisible ] = useState(false);

    return (
        <ChatContext.Provider value={{ sidebarVisible, setSidebarVisible }}>
            {children}
        </ChatContext.Provider>
    )
}