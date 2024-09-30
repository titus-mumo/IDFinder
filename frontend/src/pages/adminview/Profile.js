import React, { useEffect, useState } from 'react';
import { ApiCall } from '../../hooks';
import { useAuth } from '../../providers';
import { useSnackbar } from '../../providers/SnackProvider';
import { Input, Button } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';


export const AdminProfile = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [phone_number, setPhoneNumber] = useState()

  const showSnackBar = useSnackbar()

  const userAuth = useAuth();
  const { access, refresh, setAccess, setRefresh, logOut } = userAuth;
  const [newUsername, setNewUsername] = useState('');
  useEffect(() => {
    ApiCall('auth/user/details', 'get', access, refresh, setAccess, setRefresh, {}, {}, false, showSnackBar)
    .then((response) => {
      if(response.status !== undefined && response.status === 200){
        console.log(response)
        setEmail(response.data.email)
        setPhoneNumber(response.data.phone_number)
        setUsername(response.data.username)
        setNewUsername(response.data.username)
        return
      }
      throw new Error(response)
    })
    .catch((error) => {
      showSnackBar("An error occured")
    })
  }, [])

  const [isEditingUsername, setEditingUsername] = useState(false);
  const [isEditingPassword, setEditingPassword] = useState(false);
  
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [seeOldPassword, setSeeOldPassword] = useState(false)
  const [seeNewPassword, setSeeNewPassword] = useState(false)
  const [seeConfirmNewPassword, setSeeConfirmNewPassword] = useState(false)

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleLogout = (e) => {
    const data = {
      refresh: localStorage.getItem('refresh'),
    };
    e.preventDefault();
    ApiCall('auth/logout/', 'post', access, refresh, setAccess, setRefresh, data, {}, false, showSnackBar).then(() => {
      logOut();
    });
  };

  const handleUsernameChange = () => {
    if(newUsername === username){
      return showSnackBar("New username must be different")
    }
    if(newUsername.trim().length < 4){
      return showSnackBar("Username must be atleast 4 letters")
    }
    if(username.includes(' ')){
      return showSnackBar("Username should not include spaces")
    }
    if(newUsername.includes('admin')){
      return showSnackBar("Invalid username")
    }
    const data = {
      new_username: newUsername
    }
    ApiCall('auth/change-username/', 'put', access, refresh, setAccess, setRefresh, data, {}, false, showSnackBar)
    .then((response) => {
      if(response && response.status !== undefined && response.status === 200){
        setNewUsername(response.data.username)
        return showSnackBar("Username updated successfully")
      }
      throw new Error(response)
    })
    .catch((error) => {
      return showSnackBar("An error occured")
    })
    .finally(() => {
      setEditingUsername(false);
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      
    })
  };

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if(oldPassword.length === 0 || newPassword.length === 0 || confirmNewPassword.length === 0){
      return showSnackBar("Check to fill all the fields")
    }
    if (newPassword !== confirmNewPassword) {
      return showSnackBar("Passwords do not match!");
    }
    if (!passwordRegex.test(newPassword)) {
      return showSnackBar("Weak password!");
    }

    const data = {
      "current_password": oldPassword,
      "new_password": newPassword,
      "confirm_new_password": confirmNewPassword
    }

    ApiCall('auth/change-current-password/', 'put', access, refresh, setAccess, setRefresh, data, {}, false, showSnackBar)
    .then((response) => {
      if(response && response.status !== undefined && response.status === 200){
        return showSnackBar("Password updated successfully!")
      }
      throw new Error(response)
    })
    .catch((error) => {
      return showSnackBar(error.response.data.error)
    })
    .finally(() => {
      setOldPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setEditingPassword(false);
    })
  };

  const toggleEditingUsername = () => {
    setEditingUsername(!isEditingUsername);
    if (isEditingPassword) setEditingPassword(false); // Close password editing if it's open
  };

  const toggleEditingPassword = () => {
    setEditingPassword(!isEditingPassword);
    if (isEditingUsername) setEditingUsername(false); // Close username editing if it's open
  };

  return (
    <div className="flex items-center justify-center mt-5">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 flex items-center justify-center bg-orange-600 text-white rounded-full border-4 border-white shadow-lg">
            <p className="text-4xl font-bold">{username.charAt(0).toUpperCase()}</p>
          </div>
          <h2 className="mt-4 text-2xl font-semibold">{username}</h2>
          <p className="text-gray-600">{email}</p>
          <p className="text-gray-600">{phone_number}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200"
            onClick={toggleEditingUsername}
          >
            Change Username
          </button>
          {isEditingUsername && (
            <div className="flex flex-col">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter new username"
              />
              <div className="flex justify-between mt-2">
                <button
                  className="py-1 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                  onClick={handleUsernameChange}
                >
                  Save
                </button>
                <button
                  className="py-1 px-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                  onClick={() => setEditingUsername(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <button
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition duration-200"
            onClick={toggleEditingPassword}
          >
            Change Password
          </button>
          {isEditingPassword && (
            <div className="flex flex-col">
              <Input
                type={seeOldPassword ? 'text' : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="my-2 border-2 border-gray-300 p-1 rounded-md w-full text-xs md:text-sm"
                placeholder="Enter old password"
                disableUnderline
                endAdornment={
                  <InputAdornment position='end'>
                      <IconButton onClick={() => setSeeOldPassword(prevCheck => !prevCheck)}>
                          {seeOldPassword ? <VisibilityOff className='hover:cursor-pointer' /> : <Visibility className='hover:cursor-pointer' />}
                      </IconButton>
                  </InputAdornment>
              }
              />
              <Input
                type={seeNewPassword ? 'text' : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="my-2 border-2 border-gray-300 p-1 rounded-md w-full text-xs md:text-sm"
                placeholder="Enter new password"
                disableUnderline
                endAdornment={
                  <InputAdornment position='end'>
                      <IconButton onClick={() => setSeeNewPassword(prevCheck => !prevCheck)}>
                          {seeNewPassword ? <VisibilityOff className='hover:cursor-pointer' /> : <Visibility className='hover:cursor-pointer' />}
                      </IconButton>
                  </InputAdornment>
              }
              />
              <Input
                type={seeConfirmNewPassword ? 'text' : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="my-2 border-2 border-gray-300 p-1 rounded-md w-full text-xs md:text-sm"
                placeholder="Confirm new password"
                disableUnderline
                endAdornment={
                  <InputAdornment position='end'>
                      <IconButton onClick={() => setSeeConfirmNewPassword(prevCheck => !prevCheck)}>
                          {seeConfirmNewPassword ? <VisibilityOff className='hover:cursor-pointer' /> : <Visibility className='hover:cursor-pointer' />}
                      </IconButton>
                  </InputAdornment>
              }
              />
              <div className="flex justify-between mt-2">
                <button
                  className="py-1 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                  onClick={(e) => handlePasswordChange(e)}
                >
                  Save
                </button>
                <button
                  className="py-1 px-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                  onClick={() => setEditingPassword(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logout Option */}
        <div className="mt-6 text-center">
          <p
            className="text-blue-600 hover:underline hover:cursor-pointer"
            onClick={(e) => handleLogout(e)}
          >
            Logout
          </p>
        </div>
      </div>
    </div>
  );
};
