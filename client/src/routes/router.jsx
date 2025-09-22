import { createBrowserRouter } from "react-router";
import Landing from "../pages/Landing";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ProtectedRoute from "../components/ProtectedRoute";

export const routes = createBrowserRouter([
    {
        path : "/auth",
        Component : AuthLayout,
        children: [
            { index : true, Component : Login },
            { path : "login", Component : Login },
            { path : "register", Component : Register },
            { path : "forgot-password", Component : ForgotPassword },
        ]
    },
    {
        element : <ProtectedRoute/>,
        children : [
            { index : true, Component : Landing },
        ]
    }
]);