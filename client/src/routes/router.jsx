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
import SearchUser from "../components/chat/friend/SearchUser";

/* Settings */
import Profile from "../pages/Profile";

/* Context */
import ChatProvider from "../contexts/chat/ChatProvider";

export const routes = createBrowserRouter([
    {
        path: "/auth",
        element: <StartAuth />,
        children: [
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
                        <ChatApp />
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
                                path: "search-user",
                                element: <SearchUser />
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