import React from 'react'
import { IDFoundComponent } from '../../components'
import IDList from '../../mockData/IDData'

export const IDsIFound = () => {
  return (
    <div className='flex justify-center'>
      <div className='flex justify-center flex-col w-full mt-10'>
        {
          IDList.map((id, index) => <IDFoundComponent id={id} key={index} />)
        }
      </div>
    </div>
  )
}
