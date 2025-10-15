import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();

    // Once ready, decide route
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
}