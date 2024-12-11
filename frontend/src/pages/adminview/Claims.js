import React, { useEffect, useState } from 'react'
import { useSnackbar } from '../../providers/SnackProvider'
import { ApiCall } from '../../hooks'
import { useAuth } from '../../providers'
import { Button, Box, Typography, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const AdminClaims = () => {
  const [claims, setClaims] = useState([])
  const userAuth = useAuth()

  const {access, refresh, setAccess, setRefresh} = userAuth

  const showSnackBar = useSnackbar()

  const [viewMore, setViewMore] = useState(null)


  useEffect(() => {
    ApiCall('api/admin/view-claims/', 'get', access, refresh, setAccess, setRefresh, {}, {}, false)
    .then((response) => {
      if(response.status !== undefined && response.status === 200){
        setClaims(response.data)
        return
      }
      throw new Error(response)
    })
    .catch((error) => {
      showSnackBar("An error has occured")
    })
  },[])
  return (
    <div>
      
      {
        viewMore? <DispayCompleteClaim claim={claims.find(claim => claim.id === viewMore)} viewMore={viewMore} setViewMore={setViewMore}/>:claims.length > 0? claims.map((claim, index) => <ClaimOverview claim={claim} setViewMore={setViewMore} key={index}/>): "Claims placed will appear here"
      }
    </div>
  )
}


const getStatusColor = (status) => {
  switch (status) {
      case 'pending':
          return 'text-yellow-500';
      case 'approved':
          return 'text-green-500';
      case 'rejected':
          return 'text-red-500';
      default:
          return 'text-gray-500';
  }
};

const ClaimOverview = ({ claim, setViewMore }) => {
  const { id, id_no, id_name, claim_status } = claim;

  return (
      <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-lg shadow-md p-4 flex m-2 items-center justify-between">
          <div className="flex flex-col basis-1/5">
              <strong className='text-xs text-gray-500'>ID Number:</strong>
              <span className="text-sm font-semibold text-gray-800">{id_no}</span>
          </div>
          <div className="lg:flex flex-col basis-1/4 hidden">
              <strong className='text-xs text-gray-500'>Name:</strong>
              <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">{id_name}</span>
          </div>
          <div className="flex flex-col basis-1/5">
              <strong className='text-xs text-gray-500'>Status:</strong>
              <span className={`text-sm font-semibold ${getStatusColor(claim_status)}`}>{claim_status}</span>
          </div>
          <Button
              variant="contained"
              className="w-full text-xs md:text-sm m-auto basis-1/4 p-0"
              sx={{ borderRadius: 2, whiteSpace: 'nowrap' }}
              onClick={() => setViewMore(id)} // Set the ID of the claim to view more
          >
              View More
          </Button>
      </div>
  );
};


const DispayCompleteClaim = ({claim, viewMore, setViewMore}) => {
  const [IDDetails, setIDDetails] = useState('')
  console.log(viewMore)

  const [loading, setLoading] = useState(true)
  const showSnackBar = useSnackbar()

  const { created_at, id, date_of_birth: claimDOB, district_of_birth: claimDistrict, id_name: claimName, id_no: claimID, reference_id, selfie, image_match, claim_status, username, phone_number, chat_id } = claim;
  const { date_of_birth: IDDOB, district_of_birth: IDDistrict, id_name: IDName, id_no: IDID, modified_front_image } = IDDetails;

  const userAuth = useAuth()

  const {access, refresh, setAccess, setRefresh} = userAuth

  useEffect(() =>{
    ApiCall(`api/claim/id_detail/?id_no=${reference_id}`, 'get', access, refresh, setAccess, setRefresh, {}, {}, false, showSnackBar)
    .then((response) => {
      if(response.status !== undefined && response.status === 200){
        setIDDetails(response.data)
        setLoading(false)
        return
      }
      throw new Error(response)
    })
    .catch((error) => {
      showSnackBar("An error occured")
    })

  }, [])

  const modifiedClaimDOB = new Date(claimDOB).toLocaleDateString()
  const modifiedIDDOB = new Date(IDDOB).toLocaleDateString()
  
  const [status, setStatus] = useState(claim_status);

  const handleSeeLess = (e) => {
    e.preventDefault()
    setViewMore(null)
    setStatus(null)
  }

  const handleChange = (e) => {
    setStatus(e.target.value);
  };
  const handleActionOnClaim = (e) => {
    if(claim_status.startsWith(status)){
      return showSnackBar("Nothing changed!")
    }
    if(status === 'pending'){
      return showSnackBar("You can't change status to pending")
    }
    const data = {
      action: status === 'rejected'? 'reject': 'approve',
    }
    ApiCall(`api/approve/${id}/`, 'post', access, refresh, setAccess, setRefresh, data, {}, false, showSnackBar)
    .then((response) => {
      if(response.status !== undefined && response.status === 200) {
        showSnackBar("Claim status updated successfully")
        setTimeout(() => {window.location.reload()}, 2000)
        return
      }
      throw new Error(response)
    })
    .catch((error) => {
      showSnackBar("An error occured")
    })
  }

  const navigate = useNavigate()

  const handleNavigateToMessaging = (e) => {
    e.preventDefault()
    navigate('/admin/chats', {state: {chat_id: chat_id}})

  }
  return(
    <div>
      {
        loading? "Loading":

      <div className="p-4 flex w-full justify-center flex-col">
                <Button
        variant="contained"
        className="self-center max-w-[180px] w-full text-xs md:text-sm m-auto basis-1/4 p-0"
        sx={{ borderRadius: 2, whiteSpace: 'nowrap', marginY: 2 }}
        onClick={(e) => handleSeeLess(e)} // Set the ID of the claim to view more
      >
        Go Back
      </Button>
      <div className='mb-2'>
        <p>Claim posted by: <span onClick={(e) => handleNavigateToMessaging(e)} className='px-2 text-blue-500 hover:underline hover:cursor-pointer'>{username}</span> - {phone_number}</p>
        <p>Created on: {new Date(created_at).toLocaleDateString()}</p>
      </div>
      <table className="w-3/4 table-auto bg-white shadow-lg rounded-lg max-w-md self-center">
        <thead>
          <tr className="bg-blue-500 text-white text-xs md:text-sm rounded-lg">
            <th className="py-1 px-1 text-left">Date of Birth</th>
            <th className="py-1 px-1 text-left">District of Birth</th>
            <th className="py-1 px-1 text-left">ID Name</th>
            <th className="py-1 px-1 text-left">ID Number</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 text-xs md:text-sm">
          <tr className="hover:bg-gray-100">
            <td className="py-1 px-1 text-left whitespace-nowrap">{modifiedIDDOB}</td>
            <td className="py-1 px-1 text-left">{IDDistrict}</td>
            <td className="py-1 px-1 text-left whitespace-nowrap">{IDName}</td>
            <td className="py-1 px-1 text-left">{IDID}</td>
          </tr>
<tr className="hover:bg-gray-100 text-xs md:text-sm">
    <td
      className={`m-2 py-1 px-1 text-left whitespace-nowrap border-2 ${
        modifiedClaimDOB === modifiedIDDOB ? 'border-green-500' : 'border-red-500'
      }`}
    >
      {modifiedClaimDOB}
    </td>
    <td
      className={`py-1 px-1 text-left border-2 ${
        claimDistrict === IDDistrict ? 'border-green-500' : 'border-red-500'
      }`}
    >
      {claimDistrict}
    </td>
    <td
      className={`py-1 px-1 text-left whitespace-nowrap border-2 ${
        claimName === IDName ? 'border-green-500' : 'border-red-500'
      }`}
    >
      {claimName}
    </td>
    <td
      className={`py-1 px-1 text-left border-2 ${
        claimID === IDID ? 'border-green-500' : 'border-red-500'
      }`}
    >
      {claimID}
    </td>
  </tr>
        </tbody>
      </table>
      <div className='flex flex-col justify-center w-full'>
        <div className='flex max-w-lg self-center flex-col md:flex-row w-full'>
          <div className="mt-4 basis-1/2 w-3/4 md:w-auto self-center md:pr-2">
              <img src={modified_front_image} alt="Selfie" className="w-full h-auto rounded-lg border border-gray-300" />
          </div>
          <div className="mt-4 basis-1/2 w-3/4 md:w-auto self-center md:pl-2">
              <img src={selfie} alt="Selfie" className="w-full h-auto rounded-lg border border-gray-300" />
          </div>
      </div>
      <div className="flex items-center justify-center mt-4">
        <div
          className={`font-bold py-2 px-4 rounded-lg shadow-md ${
            image_match > 80
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'
          }`}
        >
          Image Match: 
          <span className={`${image_match > 80 ? 'text-green-800' : 'text-red-800'}`}>
            {parseFloat(image_match).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className='flex flex-col md:flex-row justify-center self-center items-center mt-3 w-full'>
        <span className='text-start mr-2'>Claim status:</span>
      <select
        className={`${status === 'pending'? 'border-yellow-500': status === 'rejected'? 'border-red-500': 'border-green-500'} border-2 rounded-md px-3 py-2 text-gray-700 mr-2`}
        value={status}
        onChange={handleChange}
      >
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
        <option value="approved">Approved</option>
      </select>
      <Button
        variant="contained"
        className="ml-2 self-center max-w-md w-auto text-xs md:text-sm m-auto basis-1/4 p-0"
        sx={{ borderRadius: 2, whiteSpace: 'nowrap', marginY: 2 }}
        onClick={(e) => handleActionOnClaim(e)} 
        disabled={claim_status.startsWith(status)}
      >
        Save Changes
    </Button>
    </div>

      </div>


    </div>

      }
    </div>
  )

}
