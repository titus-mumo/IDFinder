import React from "react"
import { useNavigate } from "react-router-dom"

export const IDFoundComponent = ({id}) => {
    const idNameParts = id.id_name.split(' ')
    const navigate = useNavigate()
    const last_part = idNameParts[2] !== undefined? idNameParts[2]: ''

    const viewIDDetail = (e) => {
        e.preventDefault()
        navigate('/id-detail', {state: {id_no: id_no}})
    }
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
            <button onClick={(e) => viewIDDetail(e)} className='text-xs md:text-xs bg-blue-500 text-white p-1 m-auto rounded-md shadow-md' >View More</button>
        </div>
        
    </div>
  )
}