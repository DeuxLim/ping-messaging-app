import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { fetchAPI } from "../../api/fetchApi";

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

    const logout = async () => {
        try{
            await fetchAPI.post('/auth/logout', null, { credentials: 'include' });

            setUser({});
            setToken("");
            setReady(true);
        } catch (error) {
            console.log(error);
            setReady(true);
        }
    }

    const refreshToken = async () => {
        try{
            const response = await fetchAPI.post('/auth/refresh', null, { credentials: 'include' });

            if (!response.user || !response.accessToken) {
                throw new Error('Invalid response data');
            }

            setUser(response.user);
            setToken(response.accessToken);
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