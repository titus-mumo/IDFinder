import React from 'react'
import { Button } from '@mui/material'

export const IDDisplayComponent = ({id}) => {
    const idNameParts = id.id_name.split(' ')
    const idNumber = id.id_no.toString()
  return (
    <div className='rounded-md border border-gray-900 p-1 shadow-md flex justify-between w-4/5 md:w-400 self-center'>
        <div className='flex flex-col justify-start'>
            <p className='text-start text-xs md:text-sm'>Name:</p>
            <p className='text-start text-xs md:text-sm'>{idNameParts[0] + ' ***** ' + idNameParts[2]}</p>
        </div>
        <div className='flex flex-col justify-start'>
            <p className='text-start text-xs md:text-sm'>ID Number:</p>
            <p className='text-start text-xs md:text-sm'>{idNumber.charAt(0) + idNumber.charAt(1) + '****' + idNumber.charAt(6) + idNumber.charAt(7)}</p>
        </div>
        <div className='flex '>
            <button className='text-xs md:text-xs bg-blue-500 text-white p-1 m-auto rounded-md shadow-md' >View More</button>
        </div>
        
    </div>
  )
}
