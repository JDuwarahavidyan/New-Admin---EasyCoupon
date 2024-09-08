import React from './sidebar.css'
import LineStyleIcon from '@mui/icons-material/LineStyle';
import TimelineIcon from '@mui/icons-material/Timeline';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { Link } from 'react-router-dom';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';


export default function Sidebar() {
  return (
    <div className='sidebar'>
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to='/' className='link'>
              <li className="sidebarListItem ">
                <LineStyleIcon className='sidebarIcon'/>
                Home
              </li>
            </Link>
            <li className="sidebarListItem">
              <TimelineIcon className='sidebarIcon'/>
              Analytics
            </li>


          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/users" className='link'>
              <li className="sidebarListItem">
                <PermIdentityIcon className="sidebarIcon" />
                Users
              </li>
            </Link>
            <Link to="/qrcode" className='link'>
              <li className="sidebarListItem">
                <AssessmentOutlinedIcon className="sidebarIcon" />
                Reports
              </li>
            </Link>
            
           
          </ul>
        </div>
      </div>
    </div>
  )
}
