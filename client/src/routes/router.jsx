import { createBrowserRouter, Navigate } from "react-router";
import ChatApp from "../pages/ChatApp";

/* Auth */
import StartAuth from "../pages/Auth/StartAuth";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";

/* Chat */
import ProtectedRoute from "../components/ProtectedRoute";
import Start from "../components/chat/start/start";
import MainWindow from "../components/chat/MainWindow";
import ChatWindow from "../components/chat/chat/ChatWindow";
import CreateNewChat from "../components/chat/chat/CreateNewChat/CreateNewChat";

/* Settings */
import Profile from "../pages/Profile";

/* Context */
import ChatProvider from "../contexts/chat/ChatProvider";
import ChatDisplayProvider from "../contexts/chat/chatDisplay/ChatDisplayProvider";

export const routes = createBrowserRouter([
    {
        path: "/auth",
        element: <StartAuth />,
        children: [
            { index: true, element: <Login /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "forgot-password", element: <ForgotPassword /> },
        ]
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/chats",
                element: (
                    <ChatProvider>
                        <ChatDisplayProvider>
                            <ChatApp />
                        </ChatDisplayProvider>
                    </ChatProvider>
                ),
                children: [
                    {
                        path: "",
                        element: <MainWindow />,
                        children: [
                            {
                                index: true,
                                element: <Start />
                            },
                            {
                                path: ":chatId",
                                element: <ChatWindow />
                            },
                            {
                                path: "create-new-chat",
                                element: <CreateNewChat/>
                            }
                        ]
                    }
                ]
            },
            {
                path: "/profile",
                element: <Profile />
            }
        ]
    },
    {
        path: "/",
        element: <Navigate to="/auth/login" replace />,
    },
]);