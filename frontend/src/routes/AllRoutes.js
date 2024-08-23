import React from 'react'
import { Routes, Route } from "react-router-dom";
import { LandingPage, Login, SignUp,ForgotPassword, ResetPassword } from "../pages/auth";

export const AllRoutes = () => {
    return(
        <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/auth/login' element={<Login />} />
            <Route path='/auth/register' element={<SignUp />} />
            <Route path='/auth/forgot-password' element={<ForgotPassword />} />
            <Route path='/auth/reset-password' element={<ResetPassword />} />
        </Routes>
    )
}