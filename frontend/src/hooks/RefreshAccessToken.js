import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { useSnackbar } from "../providers/SnackProvider";

const base_url = process.env.BASE_URL;

export const refreshAccessToken = async (refreshToken) => {
    let data;
    const api = axios.create({
        baseURL: base_url,
        headers: {
            "Content-Type": "application/json"
        }
    });

    const navigate = useNavigate(); 

    try {
        const response = await api.post('auth/refresh-token/', { refresh: refreshToken });
        data = response.data;
        return data;
    } catch (error) {
        navigate("/auth/login"); 
        return null;
    }
};