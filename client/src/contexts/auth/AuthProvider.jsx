import { useCallback, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { fetchAPI } from "../../api/fetchApi";

export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isUserReady, setIsUserReady] = useState(false);

    const login = (user, accessToken) => {
        if (!user || !accessToken) {
            console.error("Login failed: invalid user or token");
            return;
        }
        setCurrentUser(user);
        setToken(accessToken);
    };

    const logout = async () => {
        try {
            await fetchAPI.post("/auth/logout", null, { credentials: "include" });
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setCurrentUser(null);
            setToken(null);
        }
    };

    const refreshToken = useCallback(async () => {
        try {
            const res = await fetchAPI.post("/auth/refresh", null, { credentials: "include" });
            if (!res?.user || !res?.accessToken) throw new Error("Invalid refresh data");

            setCurrentUser(res.user);
            setToken(res.accessToken);
        } catch (err) {
            console.error("Token refresh failed:", err);
            setCurrentUser(null);
            setToken(null);
        } finally {
            setIsUserReady(true);
        }
    }, []);

    const updateUserProfile = async (data) => {
        try {
            fetchAPI.setAuth(token);
            const response = await fetchAPI.put('/users/update-profile', data);
            if (!response.updateSuccess) {
                console.log("failed to updated profile picture...");
            }

            setCurrentUser(response.user);
        } catch (error) {
            console.log(error);
        }
    }

    const updatePassword = async (data) => {
        try {
            fetchAPI.setAuth(token);
            const response = await fetchAPI.put('/users/update-password', data);
            if(!response.updateSuccess){
                console.log('failed to update profile picture...');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        refreshToken();
    }, [refreshToken]);

    const value = {
        currentUser,
        token,
        isUserReady,
        login,
        logout,
        refreshToken,
        isAuthenticated: Boolean(currentUser && token),
        updateUserProfile,
        updatePassword,
    };

    if (!isUserReady) return <div>Loading...</div>;

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}