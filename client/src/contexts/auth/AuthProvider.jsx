import { useCallback, useEffect, useRef, useState } from "react";
import AuthContext from "./AuthContext";
import { fetchAPI } from "../../api/fetchAPI";

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
            await fetchAPI.post("/auth/logout", null);
        } finally {
            setUnauthenticated();
        }
    };

    const refreshToken = useCallback(async () => {
        try {
            const res = await fetchAPI.post("/auth/refresh", null);

            if (!res?.accessToken) {
                throw new Error("Invalid refresh response");
            }

            // set new access token
            fetchAPI.setAuth(res.accessToken);
            setToken(res.accessToken);

            // fetch current user
            const me = await fetchAPI.get("/auth/me", null);

            if (!me?.user) {
                throw new Error("Failed to fetch user");
            }

            setAuthenticated(me.user, res.accessToken);
        } catch (error) {
            console.log(error);
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
                const response = await fetchAPI.put("/users/update-profile", data);
                if (!response.updateSuccess) {
                    console.log("failed to update profile...");
                }
                setCurrentUser(response.user);
            } catch (error) {
                console.log(error);
            }
        },
        updatePassword: async (data) => {
            try {
                const response = await fetchAPI.put("/users/update-password", data);
                if (!response.updateSuccess) {
                    console.log("failed to update password...");
                }
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