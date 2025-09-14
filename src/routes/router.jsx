import { createBrowserRouter } from "react-router";
import Landing from "../pages/Landing";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";

export const routes = createBrowserRouter([
    { index : true, Component : Landing },
    {
        path : "/auth",
        Component : AuthLayout,
        children: [
            { index : true, Component : Login },
            { path : "login", Component : Login },
            { path : "register", Component : Register },
            { path : "forgot-password", Component : ForgotPassword },
        ]
    }
]);