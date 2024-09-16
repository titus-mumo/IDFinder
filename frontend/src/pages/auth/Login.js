import { Button, Input, Typography } from '@mui/material'
import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { Google as GoogleIcon, PasswordRounded, Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from '../../providers/SnackProvider';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email'; 
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useAuth } from '../../providers';
import { ApiCall } from '../../hooks';

export const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState('')

    const showSnackBar = useSnackbar()

    const navigate = useNavigate()

    const userAuth = useAuth()
    const {setAccess, setRefresh} = userAuth

    const handleLoginWithEmail = async(e) => {
        e.preventDefault()
        if(email.length === 0 || password.length === 0){
            return showSnackBar("Check to fill all the fields!")
        }
        if(!email.includes('@')){
            return showSnackBar("Invalid email!")
        }
        const data = {
            email: email,
            password: password
        }

        const grantAccess = await userAuth.loginAction(data)
        if(!grantAccess){
            return
        }else if(grantAccess.error){
            showSnackBar(grantAccess.error)
        }else{
            localStorage.setItem('access', grantAccess.access)
            localStorage.setItem('refresh', grantAccess.refresh)
            showSnackBar("Login successful")
            setTimeout(() => {
                navigate('/home')
            }, 1000)

        }
        
    }

    const handleLoginWithGoogle = () => {

    }
  return (
    <div className='flex justify-around lg:mt-20'>
        <div className='hidden lg:flex justify-center items-center' >

        </div>
        <div className='w-full w-5/6 md:w-80 p-5 px-10 md:p-0'>
            <div>
                <p className='text-2xl font-bold my-1'>IDFinder</p>
            </div>
            <div>
                <p className='my-2 text-xl font-medium'>Login</p>
            </div>
            <form className='flex flex-col' onSubmit={(e) => handleLoginWithEmail(e)}>
            <Input
                className="my-3 border-2 border-gray-200 p-1 md:p-1.5 rounded-full w-full text-xs md:text-sm"
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disableUnderline
                startAdornment={
                    <InputAdornment position="start">
                    <EmailIcon />
                    </InputAdornment>
                }
                />
                <Input type={passwordVisible? 'text': 'password'} placeholder='Enter your password' 
                    className='mt-3 border-2 border-gray-200 p-1 md:p-1.5 rounded-full text-xs md:text-sm' 
                    disableUnderline
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    startAdornment={
                        <InputAdornment position='start'>
                            <PasswordRounded />
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position='end'>
                            <IconButton onClick={() => setPasswordVisible(prevCheck => !prevCheck)}>
                                {
                                    passwordVisible? <VisibilityOff className='hover:cursor-pointer' />:
                                    <Visibility className='hover:cursor-pointer'/>
                                }
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <Link to='/auth/forgot-password' className='text-blue-800 text-sm mb-2 self-end p-0.5'>Forgot password?</Link>
                <Button variant='contained' type='submit' className='w-full text-xs md:text-sm' sx={{borderRadius: 7, paddingY: 1, marginTop: 4}}>Login</Button>
            </form>
            <div>
                <Typography variant='body1' component='p' sx={{marginY: 3}} className='text-xs'>Don't have an account? <Link to='/auth/register' className='text-blue-700 font-medium'>Sign Up</Link></Typography>
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
                    onClick={(e) => 
                        handleLoginWithGoogle(e)}

                    className='w-full'

                    sx={{
                        borderRadius: 7,
                        marginY: 4,
                        paddingY: 1,
                    }}
                    >
                    Sign in with Google
                </Button>
            </div>

        </div>
    </div>
  )
}