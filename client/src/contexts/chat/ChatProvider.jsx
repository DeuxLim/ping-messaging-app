import { useState, useEffect } from "react";
import ChatContext from "./ChatContext";

export default function ChatProvider({ children }) {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [activeView, setActiveView] = useState(null);

    useEffect(() => {
        // Returns boolean
        const desktopQuery = window.matchMedia("(min-width: 768px)");

        // set initial value
        setIsDesktop(desktopQuery.matches);
        setActiveView(desktopQuery.matches ? "start" : null);

        // listen for changes
        const handler = (e) => {
            setIsDesktop(e.matches);
            setActiveView(e.matches ? "start" : null);
        }
        desktopQuery.addEventListener("change", handler);

        return () => desktopQuery.removeEventListener("change", handler);
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