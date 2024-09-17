import React from 'react'
import { Button } from '@mui/material'

export const IDDisplayComponent = ({id}) => {
    const idNameParts = id.id_name.split(' ')
    const last_part = idNameParts[2] !== undefined? idNameParts[2] : ''
  return (
    <div className='rounded-md border border-gray-900 p-1 shadow-md flex justify-between w-4/5 md:w-400 self-center'>
        <div className='flex flex-col justify-start'>
            <p className='text-start text-xs md:text-sm'>Name:</p>
            <p className='text-start text-xs md:text-sm'>{idNameParts[0] + ' ***** ' + last_part}</p>
        </div>
        <div className='flex flex-col justify-start'>
            <p className='text-start text-xs md:text-sm'>ID Number:</p>
            <p className='text-start text-xs md:text-sm'>{id.id_no}</p>
        </div>
        <div className='flex '>
            <button className='text-xs md:text-xs bg-blue-500 text-white p-1 m-auto rounded-md shadow-md' >Claim</button>
        </div>
        
    </div>
  )
}
