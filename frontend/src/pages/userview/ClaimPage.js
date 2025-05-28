import React, { useState } from 'react';
import { useLocation} from 'react-router-dom';
import { useAuth } from '../../providers';
import { Input, Button } from "@mui/material";
import { useSnackbar } from '../../providers/SnackProvider';
import { ApiCall } from '../../hooks';

export const ClaimPage = () => {
  const location = useLocation();
  const { primary_key } = location.state || {};
  const pk = parseInt(primary_key)
  const showSnackBar = useSnackbar();
  const userAuth = useAuth();
  const { access, refresh, setAccess, setRefresh } = userAuth;

  const [IDNo, setIDNo] = useState('');
  const [IDName, setIDName] = useState('');
  const [districtOfBirth, setDistrictOfBirth] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selfie, setSelfie] = useState(null);

  const handleClaimId = (e) => {
    e.preventDefault();
    if (IDNo.length === 0 || IDName.length === 0 || districtOfBirth.length === 0 || dateOfBirth.length === 0 || selfie === null) {
      return showSnackBar("Please fill in all fields");
    }
    if (IDNo.includes('e') || IDNo.length !== 8) {
      return showSnackBar("Invalid ID number");
    }
    if (!IDName.includes(' ')) {
      return showSnackBar("Invalid name format");
    }

    const formData = new FormData();
    formData.append("id_no", IDNo);
    formData.append("id_name", IDName);
    formData.append("district_of_birth", districtOfBirth);
    formData.append("date_of_birth", dateOfBirth);
    formData.append("selfie", selfie);

    ApiCall(`api/verify/?id_no=${pk}`, 'post', access, refresh, setAccess, setRefresh, formData, {}, true, showSnackBar)
    .then((response) => {
      if(response && response.status !== undefined && response.status === 201){
        return showSnackBar("Claim submitted successfully")
      }
      throw new Error(response)
    })
    .catch((error) => {
      console.log(error)
    })

    // navigate('/claims');
  };

  const handleEnterSelfie = (e) => {
    setSelfie(e.target.files[0]);
  };

  return (
    <div className="flex justify-center items-center w-full mt-6 p-4">
      <form 
        onSubmit={handleClaimId} 
        className="max-w-sm md:max-w-md flex flex-col justify-start bg-white p-6 md:p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-lg font-semibold mb-4">Claim ID</h2>

        {/* ID Number Input */}
        <label htmlFor="id_no" className="text-left text-sm mb-0.5">ID Number</label>
        <Input
          type="number"
          id="id_no"
          placeholder="Enter ID Number"
          value={IDNo}
          onChange={(e) => setIDNo(e.target.value)}
          disableUnderline
          className="my-2 border-2 border-gray-300 p-1 rounded-md w-full text-xs md:text-sm"
        />

        {/* ID Name Input */}
        <label htmlFor="id_name" className="text-left text-sm mb-0.5">Full Name</label>
        <Input
          type="text"
          id="id_name"
          placeholder="Enter Full Name"
          value={IDName}
          onChange={(e) => setIDName(e.target.value)}
          disableUnderline
          className="my-2 border-2 border-gray-300 p-1 rounded-md w-full text-xs md:text-sm"
        />

        {/* District of Birth Input */}
        <label htmlFor="district_of_birth" className="text-left text-sm mb-0.5">District of Birth</label>
        <Input
          type="text"
          id="district_of_birth"
          placeholder="Enter District of Birth"
          value={districtOfBirth}
          onChange={(e) => setDistrictOfBirth(e.target.value)}
          disableUnderline
          className="my-2 border-2 border-gray-300 p-1 rounded-md w-full text-xs md:text-sm"
        />

        {/* Date of Birth Input */}
        <label htmlFor="date_of_birth" className="text-left text-sm mb-0.5">Date of Birth</label>
        <Input
          type="date"
          id="date_of_birth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          disableUnderline
          className="my-2 border-2 border-gray-300 p-1 rounded-md w-full text-xs md:text-sm"
        />

        {/* Selfie Upload */}
        <label htmlFor="selfie" className="text-left text-sm mb-0.5">Upload a Selfie</label>
        <Input
          type="file"
          id="selfie"
          accept="image/*"
          onChange={handleEnterSelfie}
          disableUnderline
          fullWidth
          className="my-2 border-2 border-gray-300 p-1 rounded-md"
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          type="submit"
          className="w-full text-xs md:text-sm"
          sx={{ borderRadius: 2, paddingY: 1.5, marginTop: 4 }}
        >
          Submit Claim
        </Button>
      </form>
    </div>
  );
};
