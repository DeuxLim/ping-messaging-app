import { Outlet, Navigate } from "react-router";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute () {
    const { user, token } = useAuth();

    let isAuthenticated = false;
    if(Object.entries(user).length > 0 && token){
        isAuthenticated = true;
    }

    return isAuthenticated ? <Outlet/> : <Navigate to="/auth/login" replace />;
}