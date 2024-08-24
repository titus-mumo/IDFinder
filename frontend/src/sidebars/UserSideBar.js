import React, {useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const SideBarItemComponent = ({ item, collapse }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(item.link)}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        py: 0.5,
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: location.pathname === item.link ? 'primary.main' : 'transparent',
        '&:hover': {
          backgroundColor: location.pathname === item.link ? 'primary.main' : 'primary.light',
          transition: 'background-color 0.3s',
        },
      }}
    >
      <IconButton 
        sx={{ 
          flexBasis: '25%', 
          textAlign: 'right', 
          color: 'white',
          px: 2 
        }}
      >
        {item.icon}
      </IconButton>
      <Typography 
        sx={{ 
          flexBasis: '75%', 
          textAlign: 'left', 
          fontWeight: '500',
          display: collapse ? 'none' : 'block' 
        }}
      >
        {item.title}
      </Typography>
    </Box>
  );
};

  export const UserSideBar = ({showMenu, setShowMenu, sidebarItems}) => {

    const [collapse, setCollapse] = useState(false)

    return (
      <div className={`z-100000 ${showMenu === false? 'hidden': 'block top-9'} lg:block bg-blue-500 text-white flex items-start ${collapse === true? 'w-100': 'w-200 lg:w-250'} h-screen`}>
        <div className={`w-full flex hover:cursor-pointer hover:bg-blue-800 py-2 ${collapse === true? 'justify-center': 'justify-end pr-5'}`} onClick={() => setCollapse(preCheck => !preCheck)}>
            {
                collapse !== true?
                <ArrowBackIosIcon className='text-black' />:
                <ArrowForwardIosIcon className='text-black' />
            }
        </div>
        <div className={`flex flex-col justify-center py-1 w-full}`}>
          {
            sidebarItems.map((item, index) => <SideBarItemComponent key={index} item={item} collapse={collapse}/>
            )
          }
        </div>
      </div>
    )
  }