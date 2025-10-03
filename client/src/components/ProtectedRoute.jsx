import { Outlet, Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

export default function ProtectedRoute() {
    const { ready, isAuthenticated, token, refreshToken } = useAuth();

    useEffect(() => {
        if (!token && !ready) {
            refreshToken();
        }
    }, [token, ready, refreshToken]);

    if (!ready) {
        return;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
}