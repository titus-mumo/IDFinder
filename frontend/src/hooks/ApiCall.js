import React from "react";
import { useSnackbar } from '../providers/SnackProvider'
import axios from "axios";
import { refreshAccessToken } from "./RefreshAccessToken";

const base_url = process.env.BASE_URL;

export const ApiCall = async (endpoint, method, access, refresh, setAccess, setRefresh, data = {}, options = {}, form = {}) => {
    const headers = {
        ...options.headers,
        "Authorization": `Bearer ${access}`,
        "Content-Type": form && form === true?'multipart/form-data':"application/json"
    };

    const showSnackbar = useSnackbar();

    const api = axios.create({
        baseURL: base_url,
        headers: headers
    });

    
    try {
        let res;
        if (method === 'post') {
            res = await api.post(endpoint, data);
        } else if (method === 'get') {
            res = await api.get(endpoint);
        } else if (method === 'delete'){
            res = await api.delete(endpoint);
        } else if(method === 'put'){
            res = await api.put(endpoint, data)
        }
        return res;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token has expired, attempt to refresh it
            try {
                let response = await refreshAccessToken(refresh);
                let {newAccess, newRefresh} = response
                if (access) {
                    setAccess(newAccess);
                    setRefresh(newRefresh);
                    localStorage.setItem("access", newAccess);
                    localStorage.setItem("refresh", newRefresh);

                    // Retry the original request with the new token
                    headers["Authorization"] = `Bearer ${newAccess}`;
                    if (method === 'post') {
                        refetchedData = await api.post(endpoint, data, { headers });
                    } else if (method === 'get') {
                        refetchedData = await api.get(endpoint, { headers });
                    }else if (method === 'delete') {
                        refetchedData = await api.delete(endpoint, { headers });
                    }else if (method === 'delete'){
                        refetchedData = await api.put(endpoint, data, { headers });
                    }
                    return refetchedData
                } else {
                    showSnackbar("You are not authorized to perform this function");
                }
            } catch (refreshError) {
            
                return
            }
        } else {
            return error.response

        }
    }
};