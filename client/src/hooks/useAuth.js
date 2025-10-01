import { useContext } from "react";
import AuthContext from "../contexts/auth/AuthContext.js";

export default function useAuth(){
    return useContext(AuthContext);
}