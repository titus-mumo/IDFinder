import React from 'react'
import { Routes, Route } from "react-router-dom";
import { LandingPage, Login, SignUp,ForgotPassword, ResetPassword } from "../pages/auth";
import { Home, ContactAdmin, IDsIFound, Profile, Search, IDDetail, UploadID } from '../pages/userview';
import PrivateRoutes from './PrivateRoutes';
import ProtectUserRoutes from "./ProtectUserRoutes";
import { UserLayout } from '../layouts';


export const AllRoutes = () => {
    return(
        <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/auth/login' element={<Login />} />
            <Route path='/auth/register' element={<SignUp />} />
            <Route path='/auth/forgot-password' element={<ForgotPassword />} />
            <Route path='/auth/reset-password' element={<ResetPassword />} />
            {/* <Route element={<PrivateRoutes />} > */}
                <Route element={<UserLayout />} >
                {/* <Route element={<ProtectUserRoutes />} > */}
                    <Route path='/home' element={<Home />} />
                    <Route path='/ids-i-found' element={<IDsIFound />} />
                    <Route path='/contact-admin' element={<ContactAdmin />} />
                    <Route path='/search' element={<Search />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/id-detail' element={<IDDetail />} />
                    <Route path='/upload-id' element={<UploadID />} />
                {/* </Route> */}
                </Route>
            {/* </Route> */}
        </Routes>
    )
}