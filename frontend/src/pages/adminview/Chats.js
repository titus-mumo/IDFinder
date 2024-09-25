import React, { useEffect, useState } from 'react'
import { useSnackbar } from '../../providers/SnackProvider'
import { ApiCall } from '../../hooks'
import { useAuth } from '../../providers'

export const AdminChats = () => {
  const [roomName, setRoomName] = useState('')
  const [chats, setChats] = useState({})
  const userAuth = useAuth()
  const showSnackBar = useSnackbar()
  const {access, refresh, setAccess, setRefresh} = userAuth
  useEffect(() => {
    ApiCall('/messaging/admin/view-chats/', 'get', access, refresh, setAccess, setRefresh, {}, {}, {}, showSnackBar)
    .then((response) => {
      if(response && response.status !== undefined && response.status === 200){
        return setChats(response.data)
      }
      throw new Error(response)
    })
    .catch((error) => {
      showSnackBar("An error occured")
    })
  }, [])
  return (
    <div className='flex'>
      <div className='self-start'>
        {
          chats.length > 0? chats.map((chat) => <ShowChat chat={chat}/>): 'Chats will display here'
        }
      </div>
    </div>
  )
}

const ShowChat = ({chat}) => {
  return(
    <div className='p-2 rounded-md hover:bg-gray-200 hover:cursor-pointer w-full'>
      <p className='text-left'>{chat.room}</p>
    </div>
  )
}
