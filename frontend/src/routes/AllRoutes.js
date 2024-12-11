import React from 'react'
import { Routes, Route } from "react-router-dom";
import { LandingPage, Login, SignUp,ForgotPassword, ResetPassword } from "../pages/auth";
import { Home, ContactAdmin, IDsIFound, Profile, Search, IDDetail, UploadID, UserClaims, ClaimPage } from '../pages/userview';
import { AdminHome, AdminChats, AdminClaims, AdminProfile, AdminSearch } from '../pages/adminview';
import PrivateRoutes from './PrivateRoutes';
import ProtectUserRoutes from "./ProtectUserRoutes";
import { UserLayout, AdminLayout } from '../layouts';
import ProtectAdminRoutes from './ProtectAdminRoutes';


export const AllRoutes = () => {
    return(
        <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/auth/login' element={<Login />} />
            <Route path='/auth/register' element={<SignUp />} />
            <Route path='/auth/forgot-password' element={<ForgotPassword />} />
            <Route path='/auth/password-reset-confirm/:uidb64/:token' element={<ResetPassword />} />
            <Route element={<PrivateRoutes />} >
                <Route element={<UserLayout />} >
                    <Route element={<ProtectUserRoutes />} >
                        <Route path='/home' element={<Home />} />
                        <Route path='/ids-i-found' element={<IDsIFound />} />
                        <Route path='/contact-admin' element={<ContactAdmin />} />
                        <Route path='/search' element={<Search />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/id-detail' element={<IDDetail />} />
                        <Route path='/upload-id' element={<UploadID />} />
                        <Route path='/claims' element={<UserClaims />} />
                        <Route path='/claim-id' element={<ClaimPage />} />
                    </Route>
                </Route>
                <Route element={<AdminLayout />}>
                    <Route element={<ProtectAdminRoutes />}>
                        <Route path='/admin/home' element={<AdminHome />} />
                        <Route path='/admin/chats' element={<AdminChats />} />
                        <Route path='/admin/claims' element={<AdminClaims />} />
                        <Route path='/admin/search' element={<AdminSearch />} />
                        <Route path='/admin/profile' element={<AdminProfile />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}