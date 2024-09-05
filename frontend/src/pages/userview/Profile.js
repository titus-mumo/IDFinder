import React, {useEffect} from 'react'
import { useAuth } from '../../providers'

export const Profile = () => {
  const [user, setUser] = useState()
  useEffect(() => {
    setUser(JSON.stringify(localStorage.getItem('user')))
  },[])
  return (
    <div>
      <p>{}</p>
    </div>
  )
}
