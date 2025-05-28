import React, { useEffect, useState } from 'react';
import { ApiCall } from '../../hooks';
import { useAuth } from '../../providers';
import { useSnackbar } from '../../providers/SnackProvider';
import { Button } from '@mui/material';

export const UserClaims = () => {
    const [claims, setClaims] = useState([]);
    const [expandedClaimId, setExpandedClaimId] = useState(null); // State for expanded claim
    const showSnackBar = useSnackbar();
    const userAuth = useAuth();
    const { access, refresh, setAccess, setRefresh } = userAuth;

    useEffect(() => {
        ApiCall('/api/user-claims/', 'get', access, refresh, setAccess, setRefresh, {}, {}, {}, showSnackBar)
            .then((response) => {
                if (response && response.status !== undefined && response.status === 200) {
                    setClaims(response.data)
                    return;
                }
                throw new Error(response);
            })
            .catch((error) => {
                showSnackBar("An error occurred");
            });
    }, []);

    const handleViewMore = (claimId) => {
        setExpandedClaimId(claimId);
    };

    const handleViewLess = () => {
        setExpandedClaimId(null);
    };


    return (
        <div className='w-full h-auto flex justify-center flex-wrap'>
            {expandedClaimId ? (
                // Render only the expanded claim if one is selected
                <DisplayClaim 
                    claim={claims.find(claim => claim.id === expandedClaimId)} 
                    onViewLess={handleViewLess} 
                />
            ) : (
                // Render the list of claims when none is expanded
                claims.length > 0 ? (
                    claims.map((claim, index) => (
                        <ClaimOverview claim={claim} key={index} onViewMore={handleViewMore} />
                    ))
                ) : (
                    'Any IDs you claim will be displayed here'
                )
            )}
        </div>
    );
};

const DisplayClaim = ({ claim, onViewLess }) => {
    const { created_at, claim_status, id_name, id_no, district_of_birth, date_of_birth, selfie } = claim;

    return (
        <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-md p-4 mt-2">
            <div className="mb-4 border-b border-gray-200 pb-2">
                <h2 className="text-xl font-semibold text-gray-700">Claim Details</h2>
                <p className="text-sm text-gray-600">
                    Claim Status: 
                    <span className={`font-bold ml-2 ${getStatusColor(claim_status)}`}>
                        {claim_status}
                    </span>
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between">
                    <strong>ID Number:</strong> <span>{id_no}</span>
                </div>

                <div className="flex justify-between">
                    <strong>Name:</strong> <span>{id_name}</span>
                </div>

                <div className="flex justify-between">
                    <strong>Date of Birth:</strong> 
                    <span>{new Date(date_of_birth).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between">
                    <strong>District of Birth:</strong> <span>{district_of_birth}</span>
                </div>

                <div className="flex justify-between">
                    <strong>Submitted On:</strong> 
                    <span>{new Date(created_at).toLocaleDateString()}</span>
                </div>

                <div className="mt-4">
                    <img src={selfie} alt="Selfie" className="w-full h-auto rounded-lg border border-gray-300" />
                </div>
            </div>
            <Button
                variant="contained"
                className="w-full text-xs md:text-sm"
                sx={{ borderRadius: 2, marginTop:1 }}
                onClick={onViewLess} // Button to go back to Claim Overview
            >
                View Less
            </Button>
        </div>
    );
};

// Function to dynamically change status color
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

const ClaimOverview = ({ claim, onViewMore }) => {
    const { id, id_no, id_name, claim_status } = claim;

    return (
        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col space-y-2 m-2">
            <div className="flex flex-col">
                <strong className='text-xs text-gray-500'>ID Number:</strong>
                <span className="text-sm font-semibold text-gray-800">{id_no}</span>
            </div>
            <div className="flex flex-col">
                <strong className='text-xs text-gray-500'>Name:</strong>
                <span className="text-sm font-semibold text-gray-800">{id_name}</span>
            </div>
            <div className="flex flex-col">
                <strong className='text-xs text-gray-500'>Status:</strong>
                <span className={`text-sm font-semibold ${getStatusColor(claim_status)}`}>{claim_status}</span>
            </div>
            <Button
                variant="contained"
                className="w-full text-xs md:text-sm mt-4"
                sx={{ borderRadius: 2 }}
                onClick={() => onViewMore(id)} // Set the ID of the claim to view more
            >
                View More
            </Button>
        </div>
    );
};
