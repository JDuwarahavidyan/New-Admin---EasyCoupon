import "./userList.css";
import { DataGrid } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Link } from "react-router-dom";
import { useState, useContext, useEffect, useCallback } from "react";
import Avatar from '@mui/material/Avatar';
import { UserContext } from '../../context/userContext/UserContext';
import { deleteUser, getUsers, enableUser, disableUser } from "../../context/userContext/apiCalls";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

export default function UserList() {
  const { users, dispatch } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogType, setDialogType] = useState(null); // State to track the type of dialog (delete, enable, disable)

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    await getUsers(dispatch);
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleClickOpen = (id, type) => {
    setSelectedUserId(id);
    setDialogType(type); // Set the type of dialog (delete, enable, disable)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUserId(null);
    setDialogType(null);
  };

  const handleDelete = async () => {
    handleClose();
    setLoading(true);
    await deleteUser(selectedUserId, dispatch);
    fetchUsers(); // Re-fetch users after deletion
  };

  const handleEnable = async () => {
    handleClose();
    setLoading(true);
    await enableUser(selectedUserId, dispatch);
    updateUserStatus(selectedUserId, false);
    setLoading(false);
  };

  const handleDisable = async () => {
    handleClose();
    setLoading(true);
    await disableUser(selectedUserId, dispatch);
    updateUserStatus(selectedUserId, true);
    setLoading(false);
  };

  const handleTabChange = (event, newValue) => {
    setRoleFilter(newValue);
  };

  const updateUserStatus = (id, disabled) => {
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, disabled } : user
    );
    dispatch({ type: "GET_USERS_SUCCESS", payload: updatedUsers });
  };

  const getColumns = () => {
    const baseColumns = [
      { field: "id", headerName: "ID", width: 300 },
      {
        field: "userName",
        headerName: "User Name",
        width: 200,
        renderCell: (params) => (
          <div className="userListUser">
            <Avatar className="userListImg" src={params.row.profilePic} alt="" />
            {params.row.userName}
          </div>
        )
      },
      { field: "fullName", headerName: "Full Name", width: 200 },
      { field: "email", headerName: "Email", width: 230 },

      {
        field: "role",
        headerName: "Role",
        width: 150
      },
      {
        field: "status",
        headerName: "Status",
        width: 150,
        renderCell: (params) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            {params.row.disabled ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleClickOpen(params.row.id, 'enable')}
              >
                Enable
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleClickOpen(params.row.id, 'disable')}
              >
                Disable
              </Button>
            )}
          </div>
        )
      },
    ];

    if (roleFilter === 'student') {
      baseColumns.push({ field: "studentCount", headerName: "Count", width: 150 });
    } else if (roleFilter === 'canteen') {
      baseColumns.push({ field: "canteenCount", headerName: "Count", width: 115 });
    }

    baseColumns.push({
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Link to={"/user/" + params.row.id} state={{ users: params.row }}>
            <Button variant="outlined" color="primary" className="">
              Edit
            </Button>
          </Link>

          <DeleteOutlineIcon className="userListDelete" onClick={() => handleClickOpen(params.row.id, 'delete')} />
        </div>
      )
    });

    return baseColumns;
  };

  const columns = getColumns();

  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'all'
      ? true
      : roleFilter === 'canteen'
        ? user.role === 'canteena' || user.role === 'canteenb'
        : user.role === roleFilter;

    const matchesSearch =
      (String(user.userName).toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.fullName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    return matchesRole && matchesSearch;
  });

  return (
    <div className="userList">
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Tabs value={roleFilter} onChange={handleTabChange} aria-label="user role filter">
          <Tab label="All" value="all" />
          <Tab label="Student" value="student" />
          <Tab label="Canteen" value="canteen" />
          <Tab label="Admin" value="admin" />
        </Tabs>

        <Box display="flex" alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            style={{ marginRight: '16px', width: '300px' }} // Adjust width and margin as needed
          />
          <Link to="/newUser">
            <Button className="createButton" variant="contained" color="primary">
              Create
            </Button>
          </Link>
        </Box>

      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={filteredUsers}
          disableSelectionOnClick
          columns={columns}
          pageSize={10}
          pageSizeOptions={[10, 25, 50, 100]}
          checkboxSelection
          getRowId={(r) => r.id}
        />
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogType === 'delete' ? "Confirm Deletion" : dialogType === 'enable' ? "Confirm Enable" : "Confirm Disable"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogType === 'delete'
              ? "Are you sure you want to delete this user?"
              : dialogType === 'enable'
              ? "Are you sure you want to enable this user?"
              : "Are you sure you want to disable this user?"
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={
              dialogType === 'delete'
                ? handleDelete
                : dialogType === 'enable'
                ? handleEnable
                : handleDisable
            }
            color="primary"
            autoFocus
          >
            {dialogType === 'delete' ? "Delete" : dialogType === 'enable' ? "Enable" : "Disable"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
