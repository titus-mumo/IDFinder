import React, {useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const SideBarItemComponent = ({ item, collapse }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(item.link)}
      className={`flex justify-center items-center w-full py-1.5 text-center cursor-pointer my-0.5 rounded-md ${
        location.pathname === item.link ? 'bg-blue-700' : 'bg-transparent'
      } hover:${
        location.pathname === item.link ? 'bg-blue-700' : 'bg-blue-500'
      } transition-colors duration-300`}
    >
      <div className={`${collapse ? 'basis-1 text-center self-center' : 'basis-1/4'} px-2`}>
        {item.icon}
      </div>
      <div
        className={`font-medium text-left ${
          collapse ? 'hidden' : 'block flex-1'
        }`}
      >
        {item.title}
      </div>
    </div>
  );
};

export const UserSideBar = ({ showMenu, setShowMenu, sidebarItems }) => {
  const [collapse, setCollapse] = useState(false);

  return (
    <div
      className={`z-50 ${
        showMenu === false ? 'hidden' : 'flex'
      } fixed lg:relative lg:flex bg-blue-500 text-white flex-col items-start ${
        collapse ? 'w-16' : 'w-52 lg:w-64'
      }  lg:flex-grow h-auto`}
    >
      <div
        className={`w-full flex ${
          collapse ? 'justify-center' : 'justify-end'
        }`}
        onClick={() => setCollapse((preCheck) => !preCheck)}
      >
        {collapse ? (
          <ArrowForwardIosIcon className="text-lg rounded-md hover:cursor-pointer hover:bg-blue-800 p-1" />
        ) : (
          <ArrowBackIosIcon className="text-lg rounded-md hover:cursor-pointer hover:bg-blue-800 p-1" />
        )}
      </div>
      <div className="flex flex-col justify-center p-1 w-full">
        {sidebarItems.map((item, index) => (
          <SideBarItemComponent key={index} item={item} collapse={collapse} />
        ))}
      </div>
    </div>
  );
};
