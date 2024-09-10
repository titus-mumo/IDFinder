import React, { useState } from 'react'
import IDList from '../../mockData/IDData'
import { IDDisplayComponent } from '../../components'
import { ApiCall } from '../../hooks'
import { useAuth } from '../../providers'
import { useEffect } from 'react'
import { useSnackbar } from '../../providers/SnackProvider'

export const Home = () => {
  const userAuth = useAuth()
  const {access, setAccess, refresh, setRefresh} = userAuth
  const [existingIDs, setExistingIDs] = useState([])

  const showSnackbar = useSnackbar()

  useEffect(() => {
    ApiCall('/api/ids', 'get',access, refresh, setAccess, setRefresh, {}, {}, false, showSnackbar)
    .then(async (response) => {
      if(response && response.status && response.status === 200){
        setExistingIDs(response.data)
      }else{
        setExistingIDs(IDList)
        throw new Error(response)

      }
      if(existingIDs.length === 0){
        setExistingIDs(IDList)
      }
    })
    .catch((error) => {
      showSnackbar("An error occured")
    })
  }, [])

  return (
    <div className='flex justify-center'>
      <div className='flex justify-center flex-col w-full mt-10'>
        {
          existingIDs.map((id, index) => <IDDisplayComponent id={id} key={index} />)
        }
      </div>
    </div>
  )
}
