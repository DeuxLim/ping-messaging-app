import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute() {
    const { authStatus } = useAuth();

    // Once ready, decide route
    return authStatus === "authenticated" || authStatus === "checking"
        ? <Outlet />
        : <Navigate to="/auth/login" replace />;
}