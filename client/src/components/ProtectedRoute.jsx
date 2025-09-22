import { Outlet, Navigate } from "react-router";

export default function ProtectedRoute () {
    const isAuthenticated = true;

    return isAuthenticated ? <Outlet/> : <Navigate to="/auth/login" replace />;
}