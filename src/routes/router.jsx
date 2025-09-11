import { createBrowserRouter } from "react-router";
import Landing from "../pages/Landing";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login";
import Auth from "../pages/Auth";

export const routes = createBrowserRouter([
    { index : true, Component : Landing}, // index : true = when route to "/"
    {
        path : "/auth",
        Component : Auth,
        children: [
            { 
                index : true, 
                Component : AuthLayout, 
                children : [
                    { path : "/login", Component : Login },
                    { path : "/register", Component : Login },
                ]
            }
        ]
    }
]);