import React, {useState} from 'react'
import { Button, Input, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { Google as GoogleIcon } from '@mui/icons-material';
import { useSnackbar } from '../../providers/SnackProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

require('dotenv').config()

export const SignUp = () => {
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [seePassword, setSeePassword] = useState(false)
    const [seeConfirmPassword, setSeeConfirmPassword] = useState(false) 

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const showSnackBar = useSnackbar()
    const navigate = useNavigate()

    const handleRegisterWithEmail = (e) => {
        e.preventDefault()
        if (email.length === 0 || phoneNumber.length === 0 || password.length === 0 || confirmPassword.length === 0){
            return showSnackBar("Check to fill all the fields!")
        }
        if(!email.includes('@')){
            return showSnackBar("Invalid email")
        }
        if(phoneNumber.length !== 10){
            return showSnackBar("Phone number is invalid")
        }
        if(!phoneNumber.toString().startsWith('0')){
            return showSnackBar("Phone number should start with 0")
        }
        if(password.length < 8){
            return showSnackBar("Short too password!")
        }

        if(!passwordRegex.test(password)){
            return showSnackBar("Weak password!")
        }
        if(password !== confirmPassword){
            return showSnackBar("Passwords do not match!")
        }

        const formattedPhoneNumber =  `+254-${phoneNumber.slice(1)}`;

        const data = {
            email: email,
            phone_number: formattedPhoneNumber,
            password: password

        }

        axios.post(process.env.BASE_URL + 'auth/register/', data)
        .then((response) => {
            showSnackBar("Sign Up success!")
            setTimeout(() => {
                navigate('/auth/login')
            }, 1000)
        })
        .catch((error) => {
            showSnackBar("An error occured")
        })
    }

    const continueWithGoogle = (e) => {
        e.preventDefault(e)
    }


  return (
    <div className='flex justify-around mt-20'>
        <div className='hidden lg:flex justify-center items-center' >

        </div>
        <div className='w-4/5 sm:w-3/5 md:w-80 p-5 px-10 md:p-0'>

            <div>
                <p className='text-2xl font-bold my-1'>IDFinder</p>
            </div>
            <div>
                <p className='my-2 text-xl font-medium'>Sign Up</p>
            </div>
            <form className='flex flex-col' onSubmit={(e) => handleRegisterWithEmail(e)}>
                <Input className='mt-2 border-2 border-gray-200 px-2 py-1 rounded-full text-sm' type='text' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} disableUnderline></Input>
                <Input 
                    className='mt-2 border-2 border-gray-200 px-2 py-1 rounded-full text-sm' 
                    type='number' 
                    placeholder='Enter your phone number' 
                    value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} 
                    disableUnderline>
                </Input>
                <Input 
                    type={seePassword? 'text': "password"}
                    placeholder='Enter your password' 
                    className='mt-3 border-2 border-gray-200 px-2 py-1 rounded-full text-sm' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    disableUnderline
                    endAdornment={
                        <InputAdornment position='end'>
                            <IconButton onClick={() => setSeePassword(prevCheck => !prevCheck)}>
                                {
                                    seePassword? <VisibilityOff className='hover:cursor-pointer' />:
                                    <Visibility className='hover:cursor-pointer'/>
                                }
                            </IconButton>
                        </InputAdornment>
                    }
                >

                </Input>
                <Input 
                    type={seeConfirmPassword? 'text': "password"} 
                    placeholder='Confirm password' 
                    className='mt-3 border-2 border-gray-200 px-2 py-1 rounded-full text-sm' 
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                    disableUnderline
                    endAdornment={
                        <InputAdornment position='end'>
                            <IconButton onClick={() => setSeeConfirmPassword(prevCheck => !prevCheck)}>
                                {
                                    seeConfirmPassword? <VisibilityOff className='hover:cursor-pointer' />:
                                    <Visibility className='hover:cursor-pointer'/>
                                }
                            </IconButton>
                        </InputAdornment>
                    }
                >
                </Input>
                <Button variant='contained' type='submit' className='w-full' sx={{borderRadius: 7, paddingY: 1.5, marginTop: 4}}>Sign Up</Button>
            </form>
            <div>
                <Typography variant='body1' component='p' sx={{marginY: 3}}>Already have an account? <Link to='/auth/login' className='text-blue-700 font-medium'>Login</Link></Typography>
            </div>
            <div>
                <Typography sx={{color: 'GrayText'}} variant='body1' component='p'>------------OR------------</Typography>
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
                    onClick={(e) => {
                        continueWithGoogle(e)
                    }}

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
  )
}
