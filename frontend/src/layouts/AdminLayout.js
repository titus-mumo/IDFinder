import React, {useState} from 'react'
import { Outlet } from 'react-router-dom';
import { UserSideBar } from '../sidebars'
import { useAuth } from '../providers';
import { ApiCall } from '../hooks';
import { useSnackbar } from '../providers/SnackProvider';


import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';


const useSideBarItems = [
    {
        title: "Home",
        link: '/admin/home',
        icon: <HomeIcon />
    },
    {
        title: "Claims",
        link: '/admin/claims',
        icon: <HomeIcon />
    },
    {
        title: "Messaging",
        link: '/admin/chats',
        icon: <ContactEmergencyIcon />
    },
    {
        title: "Search",
        link: '/admin/search',
        icon: <SearchIcon />
    },
    {
        title: "Profile",
        link: '/admin/profile',
        icon: <AccountBoxIcon />
    },
]

export const AdminLayout = () => {
    const [showMenu, setShowMenu] = useState(false)

    const showSnackBar = useSnackbar()

    const userAuth = useAuth()
    const {access, setAccess, refresh, setRefresh, logOut} = userAuth

    const handleDisplaySideBar = (e) => {
        e.preventDefault()
        setShowMenu((prevCheck) => !prevCheck)
    }

    const handleLogout = (e) => {
        const data = {
            refresh: localStorage.getItem("refresh")
            }
        e.preventDefault()
        ApiCall('auth/logout/', 'post', access, refresh, setAccess, setRefresh,data, {}, false, showSnackBar)
        .then((response) => {
            if(response && response.status && response.status === 205){
                logOut()
                showSnackBar("logout successful")
            }else{
                throw new Error(response)
            }
        })
        .catch((error) => {
            showSnackBar(error.error || "Something went wrong")
        })
    }
  return (
    <div className='flex flex-col h-screen flex-grow'>
        <div className='flex justify-between bg-green-400 p-2'>
            <div>
                <div className='lg:hidden'>
                {
                    showMenu? <CloseIcon onClick={(e) => handleDisplaySideBar(e)} className='md:hidden hover:cursor-pointer'/>:
                    <MenuIcon onClick={(e) => handleDisplaySideBar(e)} className='md:hidden hover:cursor-pointer'/>
                }
                </div>
            </div>
            <p className='hover:cursor-pointer' onClick={(e) => handleLogout(e)}>LOGOUT</p>
        </div>
        <div className='lg:flex flex-grow'>
            <UserSideBar showMenu={showMenu} setShowMenu={setShowMenu} sidebarItems={useSideBarItems}/>
            <div className='w-full'>
                <div className=' md:w-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    </div>
  )
}