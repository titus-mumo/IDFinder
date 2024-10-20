import React, { useEffect, useState } from 'react'
import { CountCard } from '../../admincomponents'
import { ApiCall } from '../../hooks'
import { useAuth } from '../../providers'
import { useSnackbar } from '../../providers/SnackProvider'

export const AdminHome = () => {
    const [totalIds, setTotalIds] = useState(0)
    const [idsClaimed, setIdsClaimed] = useState(0)
    const [idsFoundThisMonth, setIdsFoundsThisMonth] = useState(0)
    const [idsClaimedThisMonth, setIdsClaimedThisMonth] = useState(0)
    
    const userAuth = useAuth()
    const {access, refresh, setAccess, setRefresh} = userAuth

    const showSnackBar = useSnackbar()

    useEffect(() => {
        ApiCall('api/dashboard/', 'get', access, refresh, setAccess, setRefresh, {}, {}, {}, showSnackBar)
        .then((response) => {
            if(response && response.status !== undefined && response.status === 200){
                const {total_ids, total_ids_claimed, total_ids_found_this_month, total_ids_claimed_this_month} = response.data
                setTotalIds(total_ids)
                setIdsClaimed(total_ids_claimed)
                setIdsFoundsThisMonth(total_ids_found_this_month)
                setIdsClaimedThisMonth(total_ids_claimed_this_month)
                return
            }
            throw new Error(response)
        })
        .catch((error) => {
            showSnackBar("An error occured")
        })
    }, [])

  return (
        <div className='flex justify-center w-full'>
        <div className='grid grid-cols-2 md:grid-cols-2 gap-4 w-full max-w-4xl'>
            <div className='flex justify-center'>
                <CountCard name='Total Found IDs' count={totalIds}/>
            </div>
            <div className='flex justify-center'>
                <CountCard name='Total Claimed IDs' count={idsClaimed}/>
            </div>
            <div className='flex justify-center'>
                <CountCard name='IDs Found This Month' count={idsFoundThisMonth}/>
            </div>
            <div className='flex justify-center'>
                <CountCard name='Total Claimed IDs This Month' count={idsClaimedThisMonth}/>
            </div>
        </div>
        </div>
  )
}
