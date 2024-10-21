import React, { useContext } from 'react'; 
import './sidebar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import LineStyleIcon from '@mui/icons-material/LineStyle';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { AuthContext } from '../../context/authContext/AuthContext';
import { logout } from '../../context/authContext/AuthActions';


export default function Sidebar() {
  const location = useLocation(); 
  const {dispatch} = useContext(AuthContext);
  const navigate = useNavigate(); 

  const handleLogout = () => {
    dispatch(logout()); 
    localStorage.removeItem("user"); 
    navigate("/"); 
};

  return (
    <div className='sidebar'>
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to='/' className='link'>
              <li className={`sidebarListItem ${location.pathname === '/' ? 'active' : ''}`}>
                <LineStyleIcon className='sidebarIcon' />
                Home
              </li>
            </Link>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/users" className='link'>
              <li className={`sidebarListItem ${location.pathname === '/users' ? 'active' : ''}`}>
                <PermIdentityIcon className="sidebarIcon" />
                Users
              </li>
            </Link>
            <Link to="/qrcode" className='link'>
              <li className={`sidebarListItem ${location.pathname === '/qrcode' ? 'active' : ''}`}>
                <AssessmentOutlinedIcon className="sidebarIcon" />
                Reports
              </li>
            </Link>
          </ul>
        </div>

        {/* Logout Section */}
        <div className="sidebarLogout">
          <ul className="sidebarListlogout">
            <li className="sidebarListItemlogout" onClick={handleLogout}>
              <ExitToAppIcon className="sidebarIcon" />
              Logout
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
