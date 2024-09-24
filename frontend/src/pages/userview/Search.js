import React, { useState } from 'react'
import { Input } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  return (
    <div>
      <form>
        <div>
        <Input
                className="my-3 border-2 border-gray-200 px-1 md:px-1.5 rounded-full w-full text-xs md:text-sm max-w-md"
                type="text"
                placeholder="Enter id no. or first name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disableUnderline
                endAdornment={
                    <InputAdornment position="start">
                    <SearchIcon />
                    </InputAdornment>
                }
                />
        </div>
      </form>

    </div>
  )
}
