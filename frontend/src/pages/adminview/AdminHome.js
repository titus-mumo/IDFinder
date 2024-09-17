import React, { useState } from 'react'
import { CountCard } from '../../admincomponents'
import { ApiCall } from '../../hooks'
import { useAuth } from '../../providers'
import { useSnackbar } from '../../providers/SnackProvider'

export const AdminHome = () => {
    const [totalIds, setTotalIds] = useState(0)
    const [idsClaimed, setIdsClaimed] = useState(0)
    const [idsFoundThisMonth, setIdsFoundsThisMonth] = useState(0)
    const [idsClaimedThisMonth, setIdsClaimedThisMonth] = useState(0)

  return (
        <div className='flex justify-center w-full'>
        <div className='grid grid-cols-2 md:grid-cols-2 gap-4 w-full max-w-4xl'>
            <div className='flex justify-center'>
                <CountCard name='Total Found IDs' count={totalIds}/>
            </div>
            <div className='flex justify-center'>
                <CountCard name='Total Claimed IDs' count={totalIds}/>
            </div>
            <div className='flex justify-center'>
                <CountCard name='IDs Found This Month' count={totalIds}/>
            </div>
            <div className='flex justify-center'>
                <CountCard name='Total Claimed IDs This Month' count={totalIds}/>
            </div>
        </div>
        </div>
  )
}
