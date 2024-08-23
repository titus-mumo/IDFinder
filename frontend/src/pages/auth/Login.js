import { Button, Input, Typography } from '@mui/material'
import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { Google as GoogleIcon } from '@mui/icons-material';

export const Login = () => {
    const [email, setEmail] = useState('')


    const handleLoginWithEmail = (e) => {
        e.preventDefault()
    }

    const handleLoginWithGoogle = () => {

    }
  return (
    <div className='flex justify-around mt-20'>
        <div className='hidden lg:flex justify-center items-center' >

        </div>
        <div className='w-full md:w-80 p-5 px-10 md:p-0'>
            <div>
                <p className='text-2xl font-bold my-1'>IDFinder</p>
            </div>
            <div>
                <p className='my-2 text-xl font-medium'>Login</p>
            </div>
            <form className='flex flex-col' onSubmit={(e) => handleLoginWithEmail(e)}>
                <Input className='my-3 border-2 border-gray-200 p-2 rounded-full' type='text' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} disableUnderline></Input>
                <Input type='password' placeholder='Enter your password' className='mt-3 border-2 border-gray-200 p-2 rounded-full' disableUnderline></Input>
                <Link to='/auth/forgot-password' className='text-blue-800 text-sm mb-2 self-end p-0.5'>Forgot password?</Link>
                <Button variant='contained' type='submit' className='w-full' sx={{borderRadius: 7, paddingY: 1.5, marginTop: 4}}>Login</Button>
            </form>
            <div>
                <Typography variant='body1' component='p' sx={{marginY: 3}}>Don't have an account? <Link to='/auth/register' className='text-blue-700 font-medium'>Sign Up</Link></Typography>
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
                        handleLoginWithGoogle(e)
                    }}

                    className='w-full'

                    sx={{
                        borderRadius: 7,
                        marginY: 4,
                        paddingY: 1.5,
                    }}
                    >
                    Sign in with Google
                </Button>
            </div>

        </div>
    </div>
  )
}
