import { Children, createContext, useContext, useEffect, useState  } from "react";
import api from "../api/axios";

// Create the auth context
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    // Store user and accessToken in state

    const [user, setUser] = useState(null); // store user info
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true); //prevents flash of wrong page on reload



    // login func - calls backend , stores user + token

    const login = async(email, password) => {

        const response = await api.post("/auth/login", {email, password});
        const { accessToken } = response.data;

        // Decode token to get user info (id, role)
        const decoded = JSON.parse(atob(accessToken.split(".")[1]));

        setAccessToken(accessToken);
        setUser({id : decoded.id , role: decoded.role , name: decoded.name})

        return decoded.role; // return role so we can redirect accordingly
    }



    // Logout function - calls backend and clears state

    const logout = async () => {

        await api.post("/auth/logout");

        setUser(null);
        setAccessToken(null);
    };




    // On app load, try to refresh the token
    // so user stays logged in after page reload

    const refresh = async () => {

        try {
            const response = await api.post("/auth/refresh");
            const { accessToken } = response.data;

            const decoded = JSON.parse(atob(accessToken.split(".")[1]));

            setAccessToken(accessToken);
            setUser({ id: decoded.id, role: decoded.role, name: decoded.name });

        } catch (error) {
            
            // Refresh failed, user is not logged in
            setUser(null);
            setAccessToken(null);

            console.log(error);
        } finally{
            setLoading(false);
        }
    };



    useEffect( () => {
        refresh();
    }, []);

    return (
        <AuthContext.Provider value={ {user, accessToken, login, logout, refresh, loading} }>
            {children}
        </AuthContext.Provider>
    );
}


// Custom hook to use auth context easily in any component
export const useAuth = () => useContext(AuthContext);