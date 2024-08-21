import React, {useState} from 'react'
import { Input, Button } from '@mui/material'


export const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const handleResetPassword = (e) => {
    e.preventDefault()
    //TODO: Reset password logic
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
        </form>
      </div>
    </div>
  )
}

