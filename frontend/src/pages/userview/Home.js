import React from 'react'
import IDList from '../../mockData/IDData'
import { IDDisplayComponent } from '../../components'

export const Home = () => {
  return (
    <div className='flex justify-center'>
      <div className='flex justify-center flex-col w-full mt-10'>
        {
          IDList.map((id, index) => <IDDisplayComponent id={id} key={index} />)
        }
      </div>
    </div>
  )
}
