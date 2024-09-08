import './widgetSm.css';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import CircularProgress from '@mui/material/CircularProgress';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export default function WidgetSm() {
  const [newUsers, setNewUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNewUsers = async () => {
      try {
        const res = await axios.get('/users?new=true', {
          headers: {
            authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).customToken,
          },
        });
        setNewUsers(res.data.slice(0, 6));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getNewUsers();
  }, []);

  if (loading) {
    return (
      <div className="loadingContainer">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">
        {newUsers.map((user) => (
          <li className="widgetSmListItem" key={user.id}>
            <Stack direction="row" spacing={2}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Avatar
                  className="widgetSmImg"
                  alt="Remy Sharp"
                  src={user.profilePic}
                />
              </StyledBadge>
            </Stack>
            <div className="widgetSmUser">
              <span className="widgetSmUsername">{user.userName}</span>
              <span className="widgetSmUserTitle">{user.role}</span>
            </div>
            <Stack direction="row" spacing={2}>
              <Link to={`/user/${user.id}`} state={{ users: user }}>
                <Button className="widgetSmButton" variant="contained" startIcon={<VisibilityIcon />}>
                  Display
                </Button>
              </Link>
            </Stack>
          </li>
        ))}
      </ul>
    </div>
  );
}
