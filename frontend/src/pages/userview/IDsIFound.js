import React, { useEffect, useState } from 'react'
import { IDFoundComponent } from '../../components'
import IDList from '../../mockData/IDData'
import { Link } from 'react-router-dom'
import { ApiCall } from '../../hooks'
import { useAuth } from '../../providers'
import { useSnackbar } from '../../providers/SnackProvider'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const IDsIFound = () => {
  const [IDsIFound, setIDsIFound] = useState([])

  const userAuth = useAuth()
  const {access, refresh, setAccess, setRefresh} = userAuth
  
  const navigate = useNavigate()

  const showSnackBar = useSnackbar()
  useEffect(() => {
    ApiCall('api/ids/my', 'get', access, refresh, setAccess, setRefresh, {}, {}, false, showSnackBar)
    .then((response) => {
      if(response && response.status && response.status === 200){
        setIDsIFound(response.data)
        return
      }
      throw new Error(response.error)
    })
    .catch((error) => {
      showSnackBar("An error ocured!")
    })
  }, [])

  const handleNavigatetoUploadId = (e) => {
    e.preventDefault()
    navigate('/upload-id')
  }


  return (
    <div className='flex justify-center flex-col'>
      <div className='w-full mt-2'>
        <Button onClick={(e) => handleNavigatetoUploadId(e)} variant='contained' className=' text-xs md:text-sm' sx={{borderRadius: 2, paddingY: 1, marginY: 2}}>Upload ID</Button>
      </div>
      <div className='flex justify-center flex-col w-full mt-10'>
        {
          IDsIFound.length > 0? IDsIFound.map((id, index) => <IDFoundComponent id={id} key={index} />) : 'IDs you find will be displayed here'
        }
      </div>
    </div>
  )
}
