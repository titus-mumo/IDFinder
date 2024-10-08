import axios from "axios";

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


    try {
        const response = await api.post('auth/refresh-token/', { refresh: refreshToken });
        data = response.data;
        return data;
    } catch (error) {
        window.location.href = "/auth/login";
        return null;
    }
};