import React, {useEffect} from 'react'
import { useAuth } from '../../providers'

export const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const {email, phone_number, username} = user
  return (
    <div className='flex items-center justify-center'>
      <div className='flex flex-col justify-center p-10 bg-gray-100 rouunded-lg border-1 border-gray-400 shadow-md'>
        <div className='bg-orange-600 p-4 rounded-full border-2 border-white'>
          <p>{username.charAt(0).toUpperCase()}</p>
        </div>
      <p>{email}</p>
      <p>{phone_number}</p>
      <p>{username}</p>
      </div>
    </div>
  )
}
