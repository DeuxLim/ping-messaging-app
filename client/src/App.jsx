// App.jsx
import { RouterProvider } from "react-router";
import { routes } from "./routes/router";
import AuthProvider from "./contexts/auth/AuthProvider";
import SocketProvider from "./contexts/socket/SocketProvider";

export default function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <RouterProvider router={routes} />
            </SocketProvider>
        </AuthProvider>
    );
}