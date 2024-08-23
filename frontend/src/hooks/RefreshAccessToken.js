import axios from "axios"

const base_url = process.env.BASE_URL


export const refreshAccessToken = async (refreshToken) => {
    let data;
    const api = axios.create({
        baseURL: base_url,
        headers: {
            "Content-Type": "application/json"
        }
    });

    try {
        const response = await api.post('token/refresh/', { refresh: refreshToken });
        data = response.data
        return data;
    } catch (error) {
        return null
    }
};