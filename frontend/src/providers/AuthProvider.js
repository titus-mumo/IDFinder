import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useSnackbar } from '../providers/SnackProvider'

const AuthContext = createContext()

//TODO: use cookies to store access token
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("use")) || "")
    const [access, setAccess] = useState(localStorage.getItem('access') || "")
    const [refresh, setRefresh] = useState(localStorage.getItem("refresh") || "")

    const navigate = useNavigate()

    const showSnackbar = useSnackbar();

    const loginAction = async(data) => {
        try{
            const response = await fetch(process.env.BASE_URL + "auth/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const res = await response.json()
            if(res.access){
                setUser({"email": refresh.email})
                setAccess(res.access)
                setRefresh(res.refresh)
                localStorage.setItem('access', res.access)
                localStorage.setItem('refresh', res.refresh)
                localStorage.setItem("user", JSON.stringify({email: res.email}))
                showSnackbar('Login success!')

                const data = {
                    access: res.access,
                    refresh: res.refresh
                }
                return data

            }else{
                const data = {
                    error: "Invalid credentials"
                }
                return data
            }
        } catch(err){
            return showSnackbar(err.message || "An error occured!")
        }
    };

    const logOut = () => {
        setUser(null)
        setAccess("")
        setRefresh("")
        localStorage.removeItem("user")
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        navigate('/')
    }

    return(
        <AuthContext.Provider value={{ access, refresh, user, loginAction, logOut, setAccess, setRefresh }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
  };
