import React, { useEffect, useState } from 'react'
import { IDFoundComponent } from '../../components'
import IDList from '../../mockData/IDData'
import { Link } from 'react-router-dom'
import { ApiCall } from '../../hooks'
import { useAuth } from '../../providers'
import { useSnackbar } from '../../providers/SnackProvider'

export const IDsIFound = () => {
  const [IDsIFound, setIDsIFound] = useState([])

  const userAuth = useAuth()
  const {access, refresh, setAccess, setRefresh} = userAuth
  
  const showSnackBar = useSnackbar()
  useEffect(() => {
    ApiCall('api/ids/', 'get', access, refresh, setAccess, setRefresh, {}, {}, false, showSnackBar)
    .then((response) => {
      if(response && response.status && response.status === 200){
        if(response.data >= 0){
          setIDsIFound(response.data)
        }else{
          setIDsIFound(IDList)
        }
        return
      }
      throw new Error(response.error)
    })
    .catch((error) => {
      showSnackBar("An error ocured!")
    })
  }, [])


  return (
    <div className='flex justify-center flex-col'>
      <div className='w-full mt-2'>
        <Link to='/upload-id'>Upload Id</Link>
      </div>
      <div className='flex justify-center flex-col w-full mt-10'>
        {
          IDsIFound.map((id, index) => <IDFoundComponent id={id} key={index} />)
        }
      </div>
    </div>
  )
}
