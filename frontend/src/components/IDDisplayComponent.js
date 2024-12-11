import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const IDDisplayComponent = ({ id }) => {
  const idNameParts = id.id_name.split(' ');
  const last_part = idNameParts[2] !== undefined ? idNameParts[2] : '';

  const navigate = useNavigate();

  const handleNavigateToClaim = (e) => {
    navigate('/claim-id', { state: { primary_key: id.primary_key } });
  };

  return (
    <div className="rounded-lg border border-gray-300 p-4 shadow-lg flex justify-between items-center w-full max-w-md mx-auto bg-white">
      <div className="flex flex-col">
        <p className="text-xs md:text-sm font-semibold text-gray-500 text-left">Name:</p>
        <p className="text-sm md:text-base font-medium text-gray-800 text-left">
          {idNameParts[0] + ' ***** ' + last_part}
        </p>
      </div>

      <div className="flex flex-col">
        <p className="text-xs md:text-sm font-semibold text-gray-500">ID Number:</p>
        <p className="text-sm md:text-base font-medium text-gray-800">{id.id_no}</p>
      </div>

      <div className="ml-4">
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleNavigateToClaim}
          className="text-xs md:text-sm"
        >
          Claim
        </Button>
      </div>
    </div>
  );
};
