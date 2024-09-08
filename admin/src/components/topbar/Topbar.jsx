import React, { useContext } from 'react';
import './topbar.css';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate for navigation
import { AuthContext } from '../../context/authContext/AuthContext';
import { logout } from '../../context/authContext/AuthActions';

export default function Topbar() {
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate(); // useNavigate hook for programmatic navigation

    const handleLogout = () => {
        dispatch(logout()); // Dispatch the logout action
        localStorage.removeItem("user"); // Remove user data from localStorage
        navigate("/"); // Navigate to the login page
    };

    return (
        <div className="topbar">
            <div className="topbarWrapper">
                <div className="topLeft">
                    <Link to={"/"} className='link'>
                        <span className="logo">Easy Coupon</span>
                    </Link>
                </div>
                <div className="topRight">
                    <div className="topbarIconContainer">
                        <Badge badgeContent={1} color="primary">
                            <NotificationsIcon color='black'/>
                        </Badge>
                    </div>

                    <div className="topbarIconContainer">
                        <SettingsIcon />
                    </div>
                    <div className="topAvatar">
                        <Stack direction="row" spacing={1}>
                            <Avatar 
                                alt="Avatar" 
                                src={"https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png"} 
                                sx={{ width: 35, height: 35 }} 
                            />
                        </Stack>
                    </div>   
                    <div className="profile">
                        <KeyboardArrowDownIcon className="icon"/>
                        <div className="options">
                            <span>Settings</span>
                            <span onClick={handleLogout}>Logout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
