import { createBrowserRouter, Navigate } from "react-router";
import ChatApp from "../pages/ChatApp";

/* Auth */
import StartAuth from "../pages/Auth/StartAuth";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

/* Chat */
import ProtectedRoute from "../components/ProtectedRoute";
import Start from "../components/chat/start/Start";
import MainWindow from "../components/chat/MainWindow";
import ChatLayout from "../components/chat/chat/ChatLayout";
import NewChatLayout from "../components/chat/chat/NewChatLayout";
import ChatWindow from "../components/chat/chat/ChatWindow";
import ActiveChatWrapper from "../components/chat/chat/ActiveChatWrapper";

/* Settings */
import Profile from "../pages/Profile";

/* Context */
import ChatProvider from "../contexts/chat/ChatProvider";
import ChatDisplayProvider from "../contexts/chat/chatDisplay/ChatDisplayProvider";
import ActiveChatProvider from "../contexts/chat/ActiveChat/ActiveChatProvider";
import VerifyEmail from "../pages/Auth/VerifyEmail";

export const routes = createBrowserRouter([
    {
        path: "/auth",
        element: <StartAuth />,
        children: [
            { index: true, element: <Login /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "verify-email", element: <VerifyEmail /> },
            { path: "forgot-password", element: <ForgotPassword /> },
            { path: "reset-password", element: <ResetPassword /> },
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
                            <ActiveChatProvider>
                                <ChatApp />
                            </ActiveChatProvider>
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
                                element: <ChatLayout />,
                                children: [
                                    { index: true, element: <ChatWindow /> }
                                ]
                            },
                            {
                                path: "new",
                                element: <NewChatLayout />,
                                children: [
                                    { index: true, element: <ChatWindow /> }
                                ]
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