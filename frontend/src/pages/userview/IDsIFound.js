import React from 'react'
import { IDFoundComponent } from '../../components'
import IDList from '../../mockData/IDData'
import { Link } from 'react-router-dom'

export const IDsIFound = () => {
  return (
    <div className='flex justify-center flex-col'>
      <div className='w-full mt-2'>
        <Link to='/upload-id'>Upload Id</Link>
      </div>
      <div className='flex justify-center flex-col w-full mt-10'>
        {
          IDList.map((id, index) => <IDFoundComponent id={id} key={index} />)
        }
      </div>
    </div>
  )
}
