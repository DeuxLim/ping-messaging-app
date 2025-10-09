import { useCallback, useState } from "react";
import AuthContext from "./AuthContext.js";
import { fetchAPI } from "../../api/fetchApi";

export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState({});
    const [token, setToken] = useState("");
    const [ready, setReady] = useState(false);

    const login = (user, token) => {
        if (!user || !token) {
            console.error('Login failed: Invalid user data or token');
            return;
        }

        setCurrentUser(user);
        setToken(token);
        setReady(true);
    }

    const logout = async () => {
        try {
            await fetchAPI.post('/auth/logout', null, { credentials: 'include' });

            setCurrentUser({});
            setToken("");
            setReady(true);
        } catch (error) {
            console.log(error);
            setReady(true);
        }
    }

    const refreshToken = useCallback(async () => {
        try {
            const response = await fetchAPI.post('/auth/refresh', null, { credentials: 'include' });

            if (!response.user || !response.accessToken) {
                throw new Error('Invalid response data');
            }

            setCurrentUser(response.user);
            setToken(response.accessToken);
        } catch (error) {
            console.error('Token refresh failed:', error);
        } finally {
            setReady(true);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, token, login, logout, refreshToken, ready, isAuthenticated: Boolean(currentUser && token) }} >
            {children}
        </AuthContext.Provider>
    );
}