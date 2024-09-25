import React, { useState, useRef, useEffect } from 'react'
import chatHistory from '../../mockData/chat'
require('dotenv').config()
import { useAuth } from '../../providers'
import { ApiCall } from '../../hooks'
import { useSnackbar } from '../../providers/SnackProvider'
import moment from 'moment'

export const ContactAdmin = () => {
  const userAuth = useAuth()
  const {access, refresh, setAccess, setRefresh} = userAuth
  const [chatMessages, setChatMessages] = useState({})
  const [message, setMessage] = useState('')
  const [roomName, setRoomName] = useState('')
  const [username, setUsername] = useState('')
  const [groupedMessages, setGroupedMessages] = useState({})
  const ws = useRef(null)
  const messagesEndRef = useRef(null);
  const showSnackBar = useSnackbar()

  useEffect(() => {
    if(chatMessages.length === 0){
      return
    }else{
      setGroupedMessages(groupMessagesByDate(chatMessages));
    }
   
  }, [chatMessages]);

  useEffect(() => {
    ApiCall('messaging/view-chats/', 'get', access, refresh, setAccess, setRefresh, {}, {}, {}, showSnackBar)
    .then((response) => {
      if(response && response.status !== undefined && response.status === 200){
        setChatMessages(response.data)

      }
    })
    .catch((error) => {
      showSnackBar(error.response.data.error)
    })
    ApiCall('messaging/fetch_chat_room_name/', 'get', access, refresh, setAccess, setRefresh, {}, {}, {}, showSnackBar)
    .then((response) => {
      if(response && response.status !== undefined && response.status === 200){
        setRoomName(response.data.room_name)
        setUsername(response.data.user)

      }
    })
    .catch((error) => {
      showSnackBar(error.response.data.error)
    })

  }, [])
  useEffect(() => {
    if(roomName.length === 0){
      return
    }
    if(ws.current){
      ws.current.close()
    }
    ws.current = new WebSocket(`ws://localhost:8000/ws/messaging/${roomName}/`)
    ws.current.onerror = (error) => {
      setChatMessages([])
    }
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      data['timestamp'] = new Date();
      data['user'] = username
      setChatMessages(prevMessages => [...prevMessages, data]);
    }
  }, [roomName])



  const handleSendMessage = async(e) => {
    e.preventDefault()
    if(message.trim().length === 0) return setMessage('')
      if (ws.current) {
        ws.current.send(JSON.stringify({ message, user:username }));
        setMessage('');
    }
  }
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [groupedMessages]);
  return (
    <div className='flex flex-col justify-between p-2'>
      <div>Admin</div>
      <div className='flex flex-col justify-end self-center min-h-[600px] max-h-[600px] max-w-[700px] min-w-[500px] overflow-x-auto rounded-md border-2 border-gray-800 p-1'>
      <div className='overflow-y-auto max-h-[550px] min-h-[500px]'>
      <div className='flex flex-col '>
      <div className='flex w-full flex-col mx-1 '>
        {Object.keys(groupedMessages).map((date) => (
          <div key={date} className='my-1'>
            <div className='text-md font-medium text-center mb-0.5'>{date}</div>
            <div className={`flex flex-col w-full`}>
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
      <form className='flex self-end w-full justify-between mt-2' onSubmit={(e) => handleSendMessage(e)}>
        <input className='basis-4/5 rounded-md shadow-md p-1 border-2 border-gray-200' placeholder='Enter message here ' value={message} onChange={(e) => setMessage(e.target.value)}></input>
        <button type='submit' className='bg-gray-900 rounded-md text-white p-1.5 px-3'>Send</button>
      </form>
      </div>
    </div>
  )
}

const RenderMessage = ({message, username}) => {
  return(
    <div className={`my-0.5 p-1 max-w-1/2 w-1/4 flex justify-between  ${message.user.includes(username) === false? 'self-start bg-blue-600 rounded-r-md rounded-t-md': 'self-end rounded-l-md rounded-t-md bg-gray-500'}`}>
      <p className='text-white'>{message.message}</p>
      <p className='text-white text-xs flex text-end items-end text-right'>{moment(message.timestamp).format('h:mm a')}</p>
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
