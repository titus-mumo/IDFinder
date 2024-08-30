import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectUserRoutes = () => {

  const role = localStorage.getItem("role")
  if(role === 'admin'){
      return <Navigate to='/admin' />
  } else if(role !== 'user'){
      return <Navigate to='/auth/login' />
  }
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default ProtectUserRoutes;