import { useState } from "react";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }){
    const [ user, setUser ] = useState({});
    const [ token, setToken ] = useState("");

    const login = ( user, token ) => {    
        setUser(user);
        setToken(token);
    }

    const logout = () => {
        setUser({});
        setToken("");
    }

    const refreshToken = () => {
        console.log("from the refreshToken function");
    }

    return (
        <AuthContext.Provider value={ { user, token,  login, logout, refreshToken } } >
            { children }
        </AuthContext.Provider>
    );
}