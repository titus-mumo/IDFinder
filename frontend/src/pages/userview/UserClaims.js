import React, { useEffect, useState } from 'react'
import { ApiCall } from '../../hooks'
import { useAuth } from '../../providers'
import { useSnackbar } from '../../providers/SnackProvider'

export const UserClaims = () => {
    const [Claims, setClaims] = useState([])
    const showSnackBar = useSnackbar()
    const userAuth = useAuth()
    const {access, refresh, setAccess, setRefresh} = userAuth

    useEffect(() => {
        ApiCall('/api/claim', 'get', access, refresh, setAccess, setRefresh, {}, {}, {}, showSnackBar)
        .then((response) => {
            if(response !== undefined && response.status !== undefined && response.status === 200){
                setClaims(response.data)
                return
            }
            throw new Error(response)
        })
        .catch((error) => {
            showSnackBar("An error occured")
        })
    }, [])
    

  return (
    <div className='w-full h-auto flex justify-center'>
        {
            Claims.length > 0? Claims.map((claim, index) => <DislayClaim claim={claim} key={index} />):'Any IDs you claim will displayed here'
        }
    </div>
  )
}

const DislayClaim = ({claim}) => {
    const {timestamp, status, name, id_no} = claim
    return(
        <div>

        </div>
    )

}
