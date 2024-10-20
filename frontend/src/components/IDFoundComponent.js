import React from "react";
import { useNavigate } from "react-router-dom";

export const IDFoundComponent = ({ id }) => {
  const idNameParts = id.id_name.split(' ');
  const navigate = useNavigate();
  const last_part = idNameParts[2] !== undefined ? idNameParts[2] : '';

  const viewIDDetail = (e) => {
    e.preventDefault();
    navigate('/id-detail', { state: { id_no: id.id_no } });
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
        <button
          onClick={(e) => viewIDDetail(e)}
          className="text-xs md:text-sm bg-blue-600 text-white px-3 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
        >
          View More
        </button>
      </div>
    </div>
  );
};
