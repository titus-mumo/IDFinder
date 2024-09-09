import React, { useState } from 'react'
import chatHistory from '../../mockData/chat'

export const ContactAdmin = () => {
  const [message, setMessage] = useState('')

  const handleSendMessage = (e) => {
    e.preventDefault()
  }
  return (
    <div className='flex flex-col justify-between  p-2'>
      <div>Admin</div>
      <div className='flex flex-col '>
        {
          chatHistory.map((message, index) => <RenderMessage message={message} key={index}/>)
        }
      </div>
      <form className='flex w-full justify-between mt-2' onSubmit={(e) => handleSendMessage(e)}>
        <input className='basis-4/5 rounded-md shadow-md p-1 border-2 border-gray-200' placeholder='Enter message here ' value={message} onChange={(e) => setMessage(e.target.value)}></input>
        <button type='submit' className='bg-gray-900 rounded-md text-white p-1.5 px-3'>Send</button>
      </form>
    </div>
  )
}

const RenderMessage = ({message}) => {
  return(
    <div className={`my-0.5 p-1 max-w-1/2 w-1/4 flex justify-between  ${message.name === 'admin'? 'self-start bg-blue-600 rounded-r-md rounded-t-md': 'self-end rounded-l-md rounded-t-md bg-gray-500'}`}>
      <p className='text-white'>{message.message}</p>
      <p className='text-white text-xs flex text-end items-end text-right'>{message.time}</p>
    </div>
  )
}
