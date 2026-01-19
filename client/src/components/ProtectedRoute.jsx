import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

export default function ProtectedRoute() {
    const { isAuthenticated, authStatus, refreshToken } = useAuth();

    useEffect(() => {
        refreshToken();
    }, [refreshToken]);

    if (authStatus === "checking") return null; // add skeleton loading here


    // Once ready, decide route
    return isAuthenticated
        ? <Outlet />
        : <Navigate to="/auth/login" replace />;
}