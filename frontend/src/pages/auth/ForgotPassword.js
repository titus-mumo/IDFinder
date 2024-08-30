import { Typography, Input, Button } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from '../../providers/SnackProvider';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [active, setActive] = useState('email')

    const showSnackBar = useSnackbar()

    const navigate = useNavigate()

    const handleSendCode = (e) => {
        e.preventDefault()
        // TODO: send code logic
        showSnackBar('Code sent to', active === 'email' ? email : phoneNumber)
    }

    const handleConfirmationCode = (e) => {
        e.preventDefault()

        // TODO: confirmation code logic

        setTimeout(() => {
            navigate('/auth/reset-password')
        }, 1000)
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
                <form onSubmit={handleConfirmationCode}>
                    <Typography variant='body1' component='p'>Enter your email or phone number, we will send you a confirmation code</Typography>
                    
                    <div className='flex justify-around mt-5'>
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
                    </div>
                    
                    <div className='flex justify-around mt-5'>
                        {
                            active === 'email'? 
                            <Input 
                            onClick={() => setActive('email')} 
                            className={`border-2 ${active === 'email' ? 'border-gray-800' : 'border-gray-200'} rounded-full p-1 mr-2 w-full`} 
                            value={email} 
                            placeholder='Email' 
                            onChange={(e) => setEmail(e.target.value)} 
                            disableUnderline 
                        />
                            :
                            <Input 
                            onClick={() => setActive('phone')} 
                            className={`border-2 ${active === 'phone' ? 'border-gray-800' : 'border-gray-200'} rounded-full p-1 mr-2 w-full`} 
                            value={phoneNumber} 
                            placeholder='Phone' 
                            onChange={(e) => setPhoneNumber(e.target.value)} 
                            disableUnderline 
                        />
                        }
                    </div>
                    
                    <Typography 
                        className='mr-2 w-full text-end text-blue-800 text-sm' 
                        variant='body1' 
                        component='p' 
                        onClick={handleSendCode}
                        style={{ cursor: 'pointer' }} 
                    >
                        Send code
                    </Typography>
                    
                    <Button 
                        variant='contained' 
                        type='submit' 
                        className='w-full' 
                        sx={{ borderRadius: 7, paddingY: 1.5, marginTop: 4 }}
                    >
                        Proceed
                    </Button>
                </form>
            </div>
        </div>
    )
}
