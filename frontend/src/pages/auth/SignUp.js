import React, { useState } from 'react';
import { Button, Input, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useSnackbar } from '../../providers/SnackProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

require('dotenv').config();

export const SignUp = () => {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [seePassword, setSeePassword] = useState(false);
    const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const showSnackBar = useSnackbar();
    const navigate = useNavigate();

    const handleRegisterWithEmail = (e) => {
        e.preventDefault();
        if (email.length === 0 || phoneNumber.length === 0 || password.length === 0 || confirmPassword.length === 0) {
            return showSnackBar("Check to fill all the fields!");
        }
        if (!email.includes('@') || email.includes('admin')) {
            return showSnackBar("Invalid email");
        }
        if(!phoneNumber.startsWith('07')){
            return showSnackBar("Phone number should start with '07'")
        }
        if (phoneNumber.length !== 10 || !phoneNumber.startsWith('0')) {
            return showSnackBar("Phone number is invalid");
        }
        if (password.length < 8) {
            return showSnackBar("Short password!");
        }
        if (!passwordRegex.test(password)) {
            return showSnackBar("Weak password!");
        }
        if (password !== confirmPassword) {
            return showSnackBar("Passwords do not match!");
        }

        const formattedPhoneNumber = `+254-${phoneNumber.slice(1)}`;
        const data = { email: email, phone_number: formattedPhoneNumber, password: password };

        axios.post(process.env.BASE_URL + 'auth/register/', data)
            .then((response) => {
                showSnackBar("Sign Up success!");
                setTimeout(() => {
                    navigate('/auth/login');
                }, 1000);
            })
            .catch((error) => {
                showSnackBar("An error occurred");
            });
    };

    const continueWithGoogle = (e) => {
        e.preventDefault();
    };

    return (
        <div className='flex flex-col lg:flex-row justify-center items-center min-h-screen bg-gradient-to-r from-gray-600 to-gray-900 p-5'>
            <div className='hidden lg:flex justify-center items-center w-1/2'>
                <Typography 
                    variant="h4" 
                    className="text-white p-2 font-bold text-center mb-6 tracking-wide shadow-lg"
                    style={{
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                        letterSpacing: '0.05em',
                    }}
                >
                    Welcome to <span style={{ color: '#800000', fontWeight: 'bolder' }}>IDFinder</span>
                </Typography>
            </div>
            <div className='w-full max-w-sm p-5 bg-white rounded-lg shadow-lg'>
                <div>
                    <p className='text-2xl font-bold my-1'>IDFinder</p>
                </div>
                <div>
                    <p className='my-2 text-xl font-medium'>Sign Up</p>
                </div>
                <form className='flex flex-col' onSubmit={handleRegisterWithEmail}>
                    <Input
                        className='mt-2 border-2 border-gray-200 px-2 py-1 rounded-full text-sm'
                        type='text'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disableUnderline
                    />
                    <Input
                        className='mt-2 border-2 border-gray-200 px-2 py-1 rounded-full text-sm'
                        type='number'
                        placeholder='Enter your phone number'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disableUnderline
                    />
                    <Input
                        type={seePassword ? 'text' : "password"}
                        placeholder='Enter your password'
                        className='mt-3 border-2 border-gray-200 px-2 py-1 rounded-full text-sm'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disableUnderline
                        endAdornment={
                            <InputAdornment position='end'>
                                <IconButton onClick={() => setSeePassword(prevCheck => !prevCheck)}>
                                    {seePassword ? <VisibilityOff className='hover:cursor-pointer' /> : <Visibility className='hover:cursor-pointer' />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <Input
                        type={seeConfirmPassword ? 'text' : "password"}
                        placeholder='Confirm password'
                        className='mt-3 border-2 border-gray-200 px-2 py-1 rounded-full text-sm'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disableUnderline
                        endAdornment={
                            <InputAdornment position='end'>
                                <IconButton onClick={() => setSeeConfirmPassword(prevCheck => !prevCheck)}>
                                    {seeConfirmPassword ? <VisibilityOff className='hover:cursor-pointer' /> : <Visibility className='hover:cursor-pointer' />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <Button variant='contained' type='submit' className='w-full' sx={{ borderRadius: 7, paddingY: 1.5, marginTop: 4 }}>Sign Up</Button>
                </form>
                <div>
                    <Typography variant='body1' component='p' sx={{ marginY: 3 }}>
                        Already have an account? <Link to='/auth/login' className='text-blue-700 font-medium'>Login</Link>
                    </Typography>
                </div>
                <div>
                    <Typography sx={{ color: 'GrayText' }} variant='body1' component='p'>------------OR------------</Typography>
                </div>
                <div>
                    <Button
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        style={{
                            textTransform: 'none',
                            borderColor: '#4285F4',
                            color: '#4285F4',
                        }}
                        onClick={continueWithGoogle}
                        className='w-full'
                        sx={{
                            borderRadius: 7,
                            marginY: 4,
                            paddingY: 1.5,
                        }}
                    >
                        Continue with Google
                    </Button>
                </div>
            </div>
        </div>
    );
};
