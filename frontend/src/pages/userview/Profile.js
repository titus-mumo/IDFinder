import React, {useEffect} from 'react'
import { useAuth } from '../../providers'

export const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const {email, phone_number, username} = user
  return (
    <div className='flex items-center justify-center mt-10'>
      <div className='flex flex-col justify-center p-10 bg-gray-200 rouunded-lg border-1 border-gray-400 shadow-md'>
        <div className='bg-orange-600 p-4 rounded-md border-2 border-white'>
          <p>{username.charAt(0).toUpperCase()}</p>
        </div>
      <p>{email}</p>
      <p>{phone_number}</p>
      <p>{username}</p>
      </div>
    </div>
  )
}
