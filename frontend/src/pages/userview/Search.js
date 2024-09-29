import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Input } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { Close } from '@mui/icons-material';

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredIDs, setFilteredIDs] = useState([])

  const socketRef = useRef(null)

  useEffect(() => {
    const inititializeWebSocket = () => {
      socketRef.current = new WebSocket("ws://localhost:8000/ws/search/");
  
      socketRef.current.onmessage = (event) => {
        const data  = JSON.parse(event.data)
        setFilteredIDs(data.filtered_ids)
      }
  
      socketRef.current.onerror = (error) => {
          console.log(error)
      };
  
      socketRef.current.onclose = () => {
          setTimeout(inititializeWebSocket, 1000); 
      };
  
    }

    inititializeWebSocket()

    return () => {
      if (socketRef.current) {
          socketRef.current.close();
      }
    };


  },[])


  const handleSearchQuery = (query) => {
    setSearchQuery(query);
    if(query.length === 0){
      return setFilteredIDs([])
    }
    // Send the search query over the WebSocket connection
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ search_query: query }));
    }
};



  return (
    <div className='flex justify-center flex-col w-full'>
      <form
        className="self-center max-w-md flex flex-col justify-start bg-white px-2 w-full"
      >
        <Input
                className="my-2 border-2 border-gray-300 p-1 rounded-md w-full text-xs md:text-sm"
                type="text"
                placeholder="Enter id no. "
                value={searchQuery}
                onChange={(e) => handleSearchQuery(e.target.value)}
                disableUnderline
                startAdornment={
                    <InputAdornment position="start">
                    <SearchIcon />
                    </InputAdornment>
                }
                />
      </form>
      <FilteredContainer filteredIDs={filteredIDs}/>
    </div>
  )
}

const FilteredContainer = ({ filteredIDs }) => {
  const [displayList, setDisplayList] = useState([]);

  useEffect(() => {
    setDisplayList(filteredIDs.slice(0, 5));
  }, [filteredIDs]);

  const handleClickOnClose = useCallback((index) => {
    setDisplayList((prevList) => prevList.filter((_, i) => i !== index));
  }, []);

  return (
    <div className={`${displayList.length === 0 ? 'hidden' : 'z-1000000 self-center flex bg-gray-100 flex-col w-400 rounded-md shadow-md py-1.5'}`}>
      {
        displayList.map((id, index) => (
          <div key={index} className='text-gray-900 flex justify-between items-center hover:bg-gray-300 rounded-md mx-1 py-1 px-2 hover:cursor-pointer text-sm'>
            <p className='basis-3/5 text-start text-left'>{id.id_name + ' ****'}</p>
            <p className='basis-1/5 text-start text-left'>{id.id_no + '****'}</p>
            <div onClick={() => handleClickOnClose(index)} className='basis-1/5 text-end text-right'>
              <Close />
            </div>
          </div>
        ))
      }
    </div>
  );
};
