import React, {useEffect, useState} from 'react'
import { Input, Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from '../../providers/SnackProvider'
import { Link } from 'react-router-dom'
import axios from 'axios'
require('dotenv').config()

export const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const showSnackbar = useSnackbar();

  const {uidb64, token} = useParams()

  const navigate = useNavigate()
  const handleResetPassword = (e) => {
    if(password.length < 8){
      return showSnackbar("Short password")
    }
    e.preventDefault()
    const data = {
      password: password,
      password_confirm: confirmPassword,
    }
    axios.post(process.env.BASE_URL + `auth/password-reset-confirm/${uidb64}/${token}/`, data)
    .then((response) => {
      if(response && response.status && response.status === 200){
        showSnackbar('Password reset success!');
        setTimeout(() => {
          navigate('/auth/login')
        }, 1500)
        return
      }
      throw new Error(response)

    })
    .catch((error) => {
      showSnackbar(error.response.data.error)
    })
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
            <p className='my-2 text-xl font-medium'>Reset Password</p>
        </div>
        <form className='flex flex-col' onSubmit={(e) => handleResetPassword(e)}>
          <Input type='password' placeholder='Enter your password' className='mt-3 border-2 border-gray-200 p-2 rounded-full' value={password} onChange={(e) => setPassword(e.target.value)} disableUnderline></Input>
          <Input type='password' placeholder='Confirm password' className='mt-3 border-2 border-gray-200 p-2 rounded-full' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disableUnderline></Input>
          <Button 
                        variant='contained' 
                        type='submit' 
                        className='w-full' 
                        sx={{ borderRadius: 7, paddingY: 1.5, marginTop: 4 }}
                    >
                        Reset Password
                    </Button>
          <Link to='/auth/login' className='text-blue-500 mt-3'>Go to login</Link>
        </form>
      </div>
    </div>
  )
}

