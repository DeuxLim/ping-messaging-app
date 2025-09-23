import { Outlet, Navigate } from "react-router";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute () {
    const { ready, isAuthenticated } = useAuth();

    if(!ready){
        return;
    }

    return isAuthenticated ? <Outlet/> : <Navigate to="/auth/login" replace />;
}