import { createBrowserRouter } from "react-router";
import ChatApp from "../pages/ChatApp";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ProtectedRoute from "../components/ProtectedRoute";
import ChatProvider from "../contexts/chat/ChatProvider";
import MainWindow from "../components/chat/MainWindow";
import Start from "../components/chat/start/start";
import ChatWindow from "../components/chat/chat/ChatWindow";
import SearchUser from "../components/chat/friend/SearchUser";

export const routes = createBrowserRouter([
    {
        path : "/auth",
        element : <AuthLayout/>,
        children: [
            { index : true, element : <Login/> },
            { path : "login", element : <Login/> },
            { path : "register", element : <Register/> },
            { path : "forgot-password", element : <ForgotPassword/> },
        ]
    },
    {
        element : <ProtectedRoute/>,
        children : [
            { 
                path : "/chats", 
                element : (
                    <ChatProvider>
                        <ChatApp/>
                    </ChatProvider>
                ),
                children : [
                    {
                        path : "",
                        element : <MainWindow/>,
                        children : [
                            {
                                index : true,
                                element : <Start/>
                            },
                            {
                                path : ":chatId",
                                element : <ChatWindow/>
                            },
                            {
                                path : "search-user",
                                element : <SearchUser/>
                            }
                        ]
                    }
                ] 
            }
        ]
    }
]);