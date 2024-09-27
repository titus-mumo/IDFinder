import React, { useEffect, useState, useRef } from 'react'
import { useSnackbar } from '../../providers/SnackProvider'
import { ApiCall } from '../../hooks'
import { useAuth } from '../../providers'
import moment from 'moment'

export const AdminChats = () => {
  const [activeRoomName, setActiveRoomName] = useState('')
  const [activeRoomId, setActiveRoomId] = useState('')
  const [activeChatMessages, setActiveChatMessages] = useState({})
  const [groupedMessages, setGroupedMessages] = useState({})
  const [chats, setChats] = useState({})
  const userAuth = useAuth()
  const showSnackBar = useSnackbar()
  const {access, refresh, setAccess, setRefresh} = userAuth
  const [username, setUsername] = useState('')

  const [message, setMessage] = useState('')
  const messagesEndRef = useRef(null);

  const ws = useRef(null)

  useEffect(() => {
    if(activeRoomName.length === 0){
      return
    }
    if(ws.current){
      ws.current.close()
    }
    ws.current = new WebSocket(`ws://localhost:8000/ws/messaging/${activeRoomName}/`)
    ws.current.onerror = (error) => {
    }

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setActiveChatMessages(prevMessages => [...prevMessages, data]);
      scrollToBottom()
    }
  }, [activeRoomName])



  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [groupedMessages]);

  useEffect(() => {
    setGroupedMessages(groupMessagesByDate(activeChatMessages));
  }, [activeChatMessages]);

  useEffect(() => {
    ApiCall('/messaging/admin/view-chats/', 'get', access, refresh, setAccess, setRefresh, {}, {}, {}, showSnackBar)
    .then((response) => {
      if(response && response.status !== undefined && response.status === 200){
        setUsername(response.data[0].room.split('_')[0])
        return setChats(response.data)
      }
      throw new Error(response)
    })
    .catch((error) => {
      showSnackBar("An error occured")
    })
  }, [])

  useEffect(() => {
    if(activeRoomId !== ''){
      ApiCall(`messaging/view-active-chat-messages/?chat_id=${activeRoomId}`, 'get', access, refresh, setAccess, setRefresh, {}, {}, {}, showSnackBar)
      .then((response) => {
        if(response && response.status && response.status === 200){
          console.log(response)
            setActiveChatMessages(response.data)
        }
      })
      .catch((error) => {
        showSnackBar("An error occuured")
      })
    }

  }, [activeRoomId])

  const handleSendMessage = async(e) => {
    e.preventDefault()
    if(message.trim().length === 0) return setMessage('')
      if (ws.current) {
        ws.current.send(JSON.stringify({ message, user:username }));
        setMessage('');
    }
  }

  return (
    <div className='flex justify-center mt-2'>
    <div className='flex self-center'>
      <div className='self-start mr-2 lg:w-[200px]'>
        {
          chats.length > 0? chats.map((chat, index) => <ShowChat key={index} chat={chat} setActiveRoomId={setActiveRoomId} activeRoomId={activeRoomId} setActiveRoomName={setActiveRoomName}/>): 'Chats will display here'
        }
      </div>
      <div className='flex flex-col justify-end self-center min-h-[600px] max-h-[600px] max-w-[700px] w-[400px] overflow-x-auto rounded-md border-2 border-gray-800 p-1'>
      {/* max-h-[550px] min- */}
      <div className='overflow-y-auto h-[500px]'>
      <div className='flex flex-col '>
      <div className='flex w-full flex-col mx-1 '>
        { Object.keys(groupedMessages).map((date) => (
          <div key={date} className='my-1'>
            <div className='text-md font-medium text-center mb-0.5'>{date}</div>
            <div className={`flex flex-col w-auto`}>
              {
                groupedMessages[date].map((message, index) => <RenderMessage message={message} username={username} key={index}/>)
              }
            </div>
            </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      </div>
      <form className={`${activeRoomId.length === 0? 'hidden': 'flex self-end w-full justify-between mt-2'}`} onSubmit={(e) => handleSendMessage(e)}>
        <input className='basis-4/5 rounded-md shadow-md p-1 border-2 border-gray-200' placeholder='Enter message here ' value={message} onChange={(e) => setMessage(e.target.value)}></input>
        <button type='submit' className='bg-gray-900 rounded-md text-white p-1.5 px-3'>Send</button>
      </form>
      </div>
      <div>

      </div>
    </div>
    </div>
  )
}

const ShowChat = ({chat, setActiveRoomId, activeRoomId, setActiveRoomName}) => {
  const handleJoinRoom = (e) => {
    e.preventDefault()
    setActiveRoomId(chat.chat_id)
    setActiveRoomName(chat.room)
  }
  return(
    <div className={`p-2 rounded-md hover:cursor-pointer w-full ${activeRoomId === chat.chat_id? 'bg-gray-400': 'hover:bg-gray-200'}`} onClick={(e) => handleJoinRoom(e)}>
      <p className='text-left'>{chat.room_name}</p>
      <p className='text-left text-xs'>{chat.latest_message}</p>
    </div>
  )
}


const groupMessagesByDate = (messages) => {
  const messageArray = Object.values(messages);
  const groupedMessages = messageArray.reduce((acc, msg) => {
    const date = new Date(msg.timestamp);
    const dateString = date.toLocaleDateString(); 
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(msg);
    return acc;
  }, {});

  // Sort messages within each date
  for (const date in groupedMessages) {
    groupedMessages[date].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  // Convert keys (dates) into an array and sort it
  const sortedDates = Object.keys(groupedMessages).sort((a, b) => new Date(a) - new Date(b));

  // Construct a new object with sorted dates
  const sortedGroupedMessages = {};
  sortedDates.forEach(date => {
    sortedGroupedMessages[date] = groupedMessages[date];
  });

  return sortedGroupedMessages;
};

const RenderMessage = ({message, username}) => {
  
  return(
    <div style={{ maxWidth: '75%' }} className={`my-0.5 p-1 flex justify-between  ${message.user.includes(username) === false? 'self-start bg-blue-600 rounded-r-md rounded-t-md': 'self-end rounded-l-md rounded-t-md bg-gray-500'}`}>
      <p className='text-white text-left text-sm w-auto'>{message.message}</p>
      <p className='text-white text-[10px] flex text-end items-end text-right ml-2 whitespace-nowrap'>{moment(message.timestamp).format('h:mm a')}</p>
    </div>
  )
}
