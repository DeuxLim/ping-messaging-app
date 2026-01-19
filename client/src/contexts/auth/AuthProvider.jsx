import { useCallback, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { fetchAPI } from "../../api/fetchApi";

export default function AuthProvider({ children }) {
    const [authStatus, setAuthStatus] = useState("checking");
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(null);

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
            await fetchAPI.post("/auth/logout", null, { credentials: "include" });
        } finally {
            setUnauthenticated();
        }
    };

    const refreshToken = useCallback(async () => {
        setAuthStatus("checking");

        try {
            const res = await fetchAPI.post("/auth/refresh", null, {
                credentials: "include",
            });

            if (!res?.user || !res?.accessToken) {
                throw new Error("Invalid refresh response");
            }

            setAuthenticated(res.user, res.accessToken);
        } catch (error) {
            console.log(error);
            setUnauthenticated();
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
            if (!response.updateSuccess) {
                console.log('failed to update profile picture...');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAPI.setAuth(token);
    }, [token]);

    const value = {
        currentUser,
        token,
        authStatus,
        login,
        logout,
        refreshToken,
        isAuthenticated: Boolean(currentUser && token),
        updateUserProfile,
        updatePassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}