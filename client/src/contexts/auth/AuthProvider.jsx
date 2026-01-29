import { useCallback, useEffect, useRef, useState } from "react";
import AuthContext from "./AuthContext";
import { fetchAPI } from "../../api/fetchAPI";
import { logoutService, refreshSessionService } from "../../services/auth.service";
import { updatePassword, updateProfile } from "../../services/user.service";

export default function AuthProvider({ children }) {
    const [authStatus, setAuthStatus] = useState("checking"); // "checking" | "authenticated" | "unauthenticated"
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(null);
    const hasBootstrapped = useRef(false);

    const setAuthenticated = (user, accessToken) => {
        setCurrentUser(user);
        setToken(accessToken);
        setAuthStatus("authenticated");
    };

    const setUnauthenticated = () => {
        setCurrentUser(null);
        setToken(null);
        setAuthStatus("unauthenticated");
    };

    const login = (user, accessToken) => {
        if (!user || !accessToken) {
            console.error("invalid login payload");
            return;
        }
        setAuthenticated(user, accessToken);
    };

    const logout = async () => {
        try {
            await logoutService();
        } finally {
            setUnauthenticated();
        }
    };

    const refreshToken = useCallback(async () => {
        try {
            const { user, accessToken } = await refreshSessionService();
            setAuthenticated(user, accessToken);
        } catch (err) {
            console.error("Refresh failed:", err);
            setUnauthenticated();
        }
    }, []);

    useEffect(() => {
        fetchAPI.setAuth(token);
    }, [token]);

    useEffect(() => {
        // 🔑 run refresh ONLY once on app boot
        if (hasBootstrapped.current) return;
        hasBootstrapped.current = true;

        refreshToken();
    }, [refreshToken]);

    const value = {
        currentUser,
        token,
        authStatus,
        login,
        logout,
        refreshToken,
        updateUserProfile: async (data) => {
            try {
                const response = await updateProfile(data);
                setCurrentUser(response.user);
            } catch (error) {
                console.log(error);
            }
        },
        updatePassword: async (data) => {
            try {
                const response = await updatePassword(data);

                return response;
            } catch (error) {
                console.log(error);
            }
        },
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}