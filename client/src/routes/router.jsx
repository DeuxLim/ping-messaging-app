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
            { index : true, element : <Landing/> }
        ]
    }
]);