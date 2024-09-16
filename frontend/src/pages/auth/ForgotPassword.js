import { Typography, Input, Button } from '@mui/material'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSnackbar } from '../../providers/SnackProvider';
import { useAuth } from '../../providers';
import axios from 'axios';

require('dotenv').config()



export const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [active, setActive] = useState('email')

    const showSnackBar = useSnackbar()

    const navigate = useNavigate()

    const userAuth = useAuth()
    const {access, setAccess, refresh, setRefresh} = userAuth

    const handleSendCode = (e) => {
        e.preventDefault()
        
        if(active === 'email'){
            if(email.length === 0){
                return showSnackBar("Please enter an email!")
            }
            if(!email.includes('@') || !email.includes('.')){
                return showSnackBar("Invalid email!")
            }
            const data = {
                email: email,
                base_url: window.location.origin
            }
            axios.post(process.env.BASE_URL + 'auth/password-reset/', data)
            .then((response) => {
                    if(response && response.status && response.status === 200){
                        showSnackBar("Password reset link has been send to your email!")
                    }else{

                    }
                    throw new Error(response)
                } 
            )
            .catch((error) => {
                if(error.response.status === 400){
                    return showSnackBar("User with this email does not exist")
                }
                showSnackBar("Something went wrong")
            })
        }
    }

    return (
        <div className='flex justify-around mt-20'>
            <div className='hidden lg:flex justify-center items-center'>
                {/* Additional content */}
            </div>
            <div className='w-full md:w-80 p-5 px-10 md:p-0'>
                <div>
                    <p className='text-2xl font-bold my-1'>IDFinder</p>
                </div>
                <div>
                    <p className='my-2 text-xl font-medium'>Forgot Your Password?</p>
                </div>
                <form onSubmit={handleSendCode}>
                    <Typography variant='body1' component='p'>Enter your email, we will send you a password reset link</Typography>
                    
                    {/* <div className='flex justify-around mt-5'>
                        <Typography 
                            variant='body1' 
                            component='p' 
                            className={`border-2 basis-1/3 p-1.5 rounded-full hover:cursor-pointer`} 
                            sx={{ color: active === 'email' ? '' : 'GrayText' }}
                            onClick={() => setActive('email')}
                        >
                            Email
                        </Typography>
                        <Typography 
                            variant='body1' 
                            component='p' 
                            className={`border-2 basis-1/3 p-1.5 rounded-full hover:cursor-pointer`} 
                            sx={{ color: active === 'phone' ? '' : 'GrayText' }}
                            onClick={() => setActive('phone')}
                        >
                            Phone
                        </Typography>
                    </div> */}
                    
                    <div className='flex justify-around mt-5'>
                        {
                            active === 'email'? 
                            <Input 
                            onClick={() => setActive('email')} 
                            className={`border-2 ${active === 'email' ? 'border-gray-800' : 'border-gray-200'} rounded-full p-1 pr-2 w-full`} 
                            value={email} 
                            placeholder='Email' 
                            onChange={(e) => setEmail(e.target.value)} 
                            disableUnderline 
                        />
                            :
                            <Input 
                            onClick={() => setActive('phone')} 
                            className={`border-2 ${active === 'phone' ? 'border-gray-800' : 'border-gray-200'} rounded-full p-1 pr-2 w-full`} 
                            value={phoneNumber} 
                            placeholder='Phone' 
                            onChange={(e) => setPhoneNumber(e.target.value)} 
                            disableUnderline 
                        />
                        }
                    </div>
                    <div className='flex'>
                        <Link 
                            to='/auth/login'
                            className='pr-2 w-full text-start text-blue-800 text-sm' 
                            style={{ cursor: 'pointer' }} 
                        >
                            Go back
                        </Link>
                    </div>
                
                    
                    <Button 
                        variant='contained' 
                        type='submit' 
                        className='w-full' 
                        sx={{ borderRadius: 7, paddingY: 1.5, marginTop: 4 }}
                    >
                        Send Code
                    </Button>
                </form>
            </div>
        </div>
    )
}
