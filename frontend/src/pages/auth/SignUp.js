import React, {useState} from 'react'
import { Button, Input, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { Google as GoogleIcon } from '@mui/icons-material';
import { useSnackbar } from '../../providers/SnackProvider';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const showSnackBar = useSnackbar()
    const navigate = useNavigate()

    const handleRegisterWithEmail = (e) => {
        e.preventDefault()
        showSnackBar("Sign Up success!")
        setTimeout(() => {
            navigate('/auth/login')
        }, 1000)
    }

    const continueWithGoogle = (e) => {
        e.preventDefault(e)
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
                <p className='my-2 text-xl font-medium'>Sign Up</p>
            </div>
            <form className='flex flex-col' onSubmit={(e) => handleRegisterWithEmail(e)}>
                <Input className='mt-2 border-2 border-gray-200 p-2 rounded-full' type='text' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} disableUnderline></Input>
                <Input type='password' placeholder='Enter your password' className='mt-3 border-2 border-gray-200 p-2 rounded-full' value={password} onChange={(e) => setPassword(e.target.value)} disableUnderline></Input>
                <Input type='password' placeholder='Confirm password' className='mt-3 border-2 border-gray-200 p-2 rounded-full' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disableUnderline></Input>
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
