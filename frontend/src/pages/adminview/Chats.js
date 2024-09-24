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
    ApiCall('messaging/view-chats/', 'get', access, refresh, setAccess, setRefresh, {}, {}, {}, showSnackBar)
    .then((response) => {
      if(response && response.status !== undefined && response.status === 200){
        return setChats(response.data)
      }
      throw new Error(response)
    })
    .catch((error) => {
      showSnackBar("An error occured")
    })
  }, [roomName])
  useEffect(() => {
    ApiCall('messaging/fetch_chat_room_name/', 'get', access, refresh, setAccess, setRefresh, {}, {}, {}, showSnackBar)
    .then((response) => {
      if(response && response.status !== undefined && response.data === 200){
        setRoomName(response.data.room_name)

      }
    })
    .catch((error) => {
      showSnackBar(error.response.data.error)
    })

  }, [])
  return (
    <div>
      {
        chats.length > 0? chats.map((chat) => <ShowChat chat={chat}/>): 'Chats will display here'
      }
    </div>
  )
}

const ShowChat = ({chat}) => {
  return(
    <div>
      <p>{}</p>
    </div>
  )
}
