import React, { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { ApiCall } from '../hooks'
import { useAuth } from '../providers'
import { useSnackbar } from '../providers/SnackProvider'


const ProtectAdminRoutes = () => {

  const navigate = useNavigate()

  const showSnackBar = useSnackbar()

  const userAuth = useAuth()
  const {access, setAccess,refresh, setRefresh} = userAuth


  useEffect(() => {

    ApiCall('auth/check-if-user-is-admin/', 'get', access, refresh, setAccess, setRefresh, {}, {}, {}, showSnackBar)
    .then((response) => {
      if(response && response.status && response.status === 200){
        if(response.data.staff === false){
          return navigate('/home')
        }
      }

    })
    .catch((error) => {
      showSnackBar("Something went wrong")
      return <Navigate to='/auth/login' />
    })


  }, [])
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default ProtectAdminRoutes;