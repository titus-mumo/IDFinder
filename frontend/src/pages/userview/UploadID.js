import React, { useState } from "react"
import { Input, Button } from "@mui/material"
import { useAuth } from "../../providers"
import { ApiCall } from "../../hooks"
import { useSnackbar } from "../../providers/SnackProvider"
import { FourMp } from "@mui/icons-material"

export const UploadID = () => {
    const [name, setName] = useState('')
    const [serialNumber, setSerialNumber] = useState('')
    const [IDNo, setIDno] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [gender, setGender] = useState('')
    const [districtOfBirth, setDistrictOfBirth] = useState('')
    const [dateOfIssue, setDateOfIssue] = useState('')
    const [frontImage, setFrontImage] = useState(null)
    const [backImage, setBackImage] = useState(null)
    const [idStatus, setIDstatus] = useState('Found')

    const userAuth = useAuth()
    const {access, setAccess, refresh, setRefresh} = userAuth
    
    const showSnackBar = useSnackbar()

    const handleEnterIDInfo = (e) => {
        e.preventDefault()
        if(name.length === 0 || serialNumber.length === 0 || IDNo.length === 0 || dateOfBirth.length === 0 || gender.length === 0 || districtOfBirth.length === 0 || dateOfIssue.length === 0 || frontImage === null || backImage === null){
            return showSnackBar("Check to fill all the fields!")
        }
        if(IDNo.includes('e') || IDNo.length !== 8){
            return showSnackBar("Invalid ID no.")
        }

        const formData = new FormData()
        formData.append('id_name', name)
        formData.append('sn', serialNumber)
        formData.append('id_no', IDNo)
        formData.append('date_of_birth', dateOfBirth)
        formData.append('gender', gender)
        formData.append('district_of_birth', districtOfBirth)
        formData.append('date_of_issue', dateOfIssue)
        formData.append('front_image', frontImage)
        formData.append('back_image', backImage)
        formData.append('id_status', idStatus)

        ApiCall('api/ids/add/', 'post', access, refresh, setAccess, setRefresh, formData, {}, true, showSnackBar)
        .then((response) => {
            if(response && response.status && response.status === 200){
                showSnackBar("ID added successfully!")
                return
            }
            throw new Error(response.error)
        })
        .catch((error) => {
            showSnackBar("An error occured!")
        })
    }
    
    const handeEnterFrontImage = (e) => {
        setFrontImage(e.target.files[0])
    }

    const handleEnterBackImage = (e) => {
        setBackImage(e.target.files[0])
    }
    return(
        <div className="flex justify-center w-auto">
        <form onSubmit={(e) => handleEnterIDInfo(e)} className="w-2/3 max-w-sm flex flex-col justify-start">
            <Input
                className="my-1 border-2 border-gray-200 p-0.5   rounded-md w-full text-xs md:text-sm"
                type="number"
                placeholder="Enter ID no."
                value={IDNo}
                onChange={(e) => setIDno(e.target.value)}
                disableUnderline
                />
            <Input
                className="my-1 border-2 border-gray-200 p-0.5   rounded-md w-full text-xs md:text-sm"
                type="number"
                placeholder="Enter the serial number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                disableUnderline
                />
            <Input
                className="my-1 border-2 border-gray-200 p-0.5   rounded-md w-full text-xs md:text-sm"
                type="text"
                placeholder="Enter ID name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disableUnderline
                />
            <Input
                className="my-1 border-2 border-gray-200 p-0.5   rounded-md w-full text-xs md:text-sm"
                type="date"
                placeholder="Enter date of birth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                disableUnderline
                />
                <select
                className="my-1 border-2 border-gray-200 p-1 rounded-md w-full text-md"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                >
                <option value="" disabled>Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                </select>
            <Input
                className="my-1 border-2 border-gray-200 p-0.5   rounded-md w-full text-xs md:text-sm"
                type="text"
                placeholder="Enter district of birth"
                value={districtOfBirth}
                onChange={(e) => setDistrictOfBirth(e.target.value)}
                disableUnderline
                />
            <Input
                className="my-1 border-2 border-gray-200 p-0.5   rounded-md w-full text-xs md:text-sm"
                type="date"
                placeholder="Enter date of issue"
                value={ dateOfIssue}
                onChange={(e) => setDateOfIssue(e.target.value)}
                disableUnderline
                />
                <label htmlFor="front" className=" text-left self-start">
                    Front Image
                </label>
            <Input
                id="front"
                name="front"
                className="my-1 border-2 border-gray-200 p-0.5   rounded-md w-full text-xs md:text-sm"
                type="file"
                placeholder="Front image of the id"
                accept="image/*"
                onChange={ handeEnterFrontImage}
                disableUnderline
                />
            <label htmlFor="back" className=" text-left self-start">
                    Back Image
                </label>
            <Input
                id="back"
                name="back"
                className="my-1 border-2 border-gray-200 p-0.5   rounded-md w-full text-xs md:text-sm"
                type="file"
                placeholder="Back image of the id"
                accept="image/*"
                onChange={handleEnterBackImage}
                disableUnderline
                />
             <Button variant='contained' type='submit' className='w-full text-xs md:text-sm' sx={{borderRadius: 3, paddingY: 1, marginTop: 4}}>Submit ID</Button>
        </form>
        </div>
    )

}