import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ApiCall } from "../../hooks";
import { useAuth } from "../../providers";
import { useSnackbar } from "../../providers/SnackProvider";


export const IDDetail = () => {
    const location = useLocation()
    const{id_no} = location.state || {};
    const data = {
        id_no: id_no
    }
    const [IDDetails, setIDDetails] = useState({})
    const userAuth = useAuth()

    const showSnackbar = useSnackbar()

    const {access, setAccess, refresh, setRefresh} = userAuth

    useEffect(async() => {
        ApiCall('/id_detail', access, refresh, setAccess, setRefresh, data, {}, false, showSnackbar)
        .then((response) => {
            if(response && response.status && response.status === 200){
                setIDDetails(response.data)
            }else{
                console.log(response)
                throw new Error(response)
            }
        })
        .catch((error) => {
            showSnackbar("Something went wrong!")
        })
    }, [id_no])

    return(
        <div>
            <p>Hello</p>
        </div>
    )

}