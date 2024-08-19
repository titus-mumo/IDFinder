import React from 'react'
import { Routes, Route } from "react-router-dom";
import { LandingPage } from "../pages";

export const AllRoutes = () => {
    return(
        <Routes>
            <Route path='/' element={<LandingPage />} />
        </Routes>
    )
}