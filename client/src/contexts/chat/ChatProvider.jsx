import { useState, useEffect } from "react";
import ChatContext from "./ChatContext";

export default function ChatProvider({ children }) {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [activeView, setActiveView] = useState("start");

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 768px)");

        // set initial value
        setIsDesktop(mediaQuery.matches);

        // listen for changes
        const handler = (e) => setIsDesktop(e.matches);
        mediaQuery.addEventListener("change", handler);

        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const values = { 
        sidebarVisible, 
        setSidebarVisible, 
        isDesktop, 
        activeView,
        setActiveView
    };

    return (
        <ChatContext.Provider value={ values }>
            {children}
        </ChatContext.Provider>
    )
}