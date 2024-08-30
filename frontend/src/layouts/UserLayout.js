import React, {useState} from 'react'
import { Outlet } from 'react-router-dom';
import { UserSideBar } from '../sidebars'


import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const useSideBarItems = [
    {
        title: "Home",
        link: '/home',
        icon: <HomeIcon />
    },
    {
        title: "IDs I Found",
        link: '/ids-i-found',
        icon: <HomeIcon />
    },
    {
        title: "Contact Admin",
        link: '/contact-admin',
        icon: <ContactEmergencyIcon />
    },
    {
        title: "Search",
        link: '/search',
        icon: <SearchIcon />
    },
    {
        title: "Profile",
        link: '/profile',
        icon: <AccountBoxIcon />
    },
]

export const UserLayout = () => {
    const [showMenu, setShowMenu] = useState(false)
  return (
    <div className='md:flex'>
        <UserSideBar showMenu={showMenu} setShowMenu={setShowMenu} sidebarItems={useSideBarItems}/>
        <div className='w-full h-100vh'>
            {/* <CuisineTabs />
            <MobileHeader showMenu={showMenu} setShowMenu={setShowMenu}/> */}
            <div className=''>
                <Outlet />
            </div>
        </div>
    </div>
  )
}
