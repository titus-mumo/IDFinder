import React, { useState } from 'react'
import IDList from '../../mockData/IDData'
import { IDDisplayComponent } from '../../components'
import { ApiCall } from '../../hooks'
import { useAuth } from '../../providers'
import { useEffect } from 'react'
import { useSnackbar } from '../../providers/SnackProvider'
import { resolve } from 'path'

export const Home = () => {
  const userAuth = useAuth()
  const {access, setAccess, refresh, setRefresh} = userAuth
  const [existingIDs, setExistingIDs] = useState([])

  const showSnackbar = useSnackbar()

  useEffect(() => {
    ApiCall('/api/ids', 'get',access, refresh, setAccess, setRefresh, {}, {}, false, showSnackbar)
    .then(async (response) => {
      if(response && response.status && response.status === 200){
        if(response.data !== undefined && response.data.length > 0){
          setExistingIDs(response.data)
          return
        }
        return
      }
      throw new Error(response)
    })
    .catch((error) => {
      showSnackbar(error.response.data.error)
    })
  }, [])

  return (
    <div className='flex justify-center'>
      <div className='flex justify-center flex-col w-full mt-10'>
        {
          existingIDs.length > 0? existingIDs.map((id, index) => <IDDisplayComponent id={id} key={index} />): 'Found IDs will appear here'
        }
      </div>
    </div>
  )
}
