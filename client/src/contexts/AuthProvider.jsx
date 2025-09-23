import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }){
    const [ user, setUser ] = useState({});
    const [ token, setToken ] = useState("");
    const [ ready, setReady ] = useState(false);

    const login = ( user, token ) => {    
        if (!user || !token) {
            console.error('Login failed: Invalid user data or token');
            return;
        }

        setUser(user);
        setToken(token);
        setReady(true);
    }

    const logout = () => {
        setUser({});
        setToken("");
        setReady(true);
    }

    const refreshToken = async () => {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
                method: "POST",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const authData = await response.json();
            if (!authData.user || !authData.accessToken) {
                throw new Error('Invalid response data');
            }

            setUser(authData.user);
            setToken(authData.accessToken);
            setReady(true);
        } catch (error) {
            console.error('Token refresh failed:', error);
            setReady(true);
        }
    }

    useEffect(() => {
        if(!token && !ready){
            refreshToken();
        }
    }, [token, ready]);

    return (
        <AuthContext.Provider value={ { user, token,  login, logout, refreshToken, ready, isAuthenticated: Boolean(user && token) } } >
            { children }
        </AuthContext.Provider>
    );
}