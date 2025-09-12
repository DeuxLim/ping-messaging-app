import { createBrowserRouter } from "react-router";
import Landing from "../pages/Landing";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const routes = createBrowserRouter([
    { index : true, Component : Landing },
    {
        path : "/auth",
        Component : AuthLayout,
        children: [
            { index : true, Component : Login },
            { path : "login", Component : Login },
            { path : "register", Component : Register },
        ]
    }
]);