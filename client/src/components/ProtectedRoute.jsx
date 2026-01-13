import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute() {
    const { isAuthenticated, authStatus } = useAuth();

    if (authStatus === "checking") return null; // add skeleton loading here

    // Once ready, decide route
    return isAuthenticated
        ? <Outlet />
        : <Navigate to="/auth/login" replace />;
}